var THREE = require('three');
var $ = require('jquery');
var FlyControls = require('./FlyControls');
var Noise = require('./Noise');
var IcosahedronTree = require('./IcosahedronTree');

var PLANET_RADIUS = 3390000;
var PLANET_COLOR = 0xD46622;
var CAMERA_SPEED = 10000000;
var AVG_STAR_DIST = .2; // actually about 5
var STAR_DIST_DEV = .1; // made up

$(document).ready(function() {
    main();
});

function main()
{
    var clock = new THREE.Clock();

    var scene = new THREE.Scene();

    var planet = initPlanet(scene);
    var light = initLight(scene);
    var stars = initStars(scene);
    var controls = initCamera(scene);
    var camera = controls.object;

    var renderer = new THREE.WebGLRenderer();
    //renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
    //var edges = new THREE.VertexNormalsHelper(planet, 2, 0x00ff00, 1);
    //scene.add(edges);
    var geometry = planet.geometry;
    planet.update(camera.position);
    // for (var j = 0; j < 5; ++j)
    // {
    //     var faces = geometry.faces.slice();
    //     for (var i = 0; i < faces.length; ++i)
    //     {
    //         increaseDetail(geometry, geometry.faces.indexOf(faces[i]));
    //     }
    // }

    $(window).keypress(function(e)
    {
        if (e.keyCode == 32)
        {
            planet.toggleWireframe();
        }
        else if (e.keyCode == 13)
        {
            camera.position.set(0, 0, PLANET_RADIUS*5);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        }
    });

    function update()
    {
        var delta = clock.getDelta();
        scene.remove(planet.mesh);
        scene.add(planet.update(camera.position));
        /*var geometry = planet.geometry;
        for (var i = 0; i < geometry.vertices.length; ++i)
        {
            var vertex = geometry.vertices[i];
            vertex.normalize().multiplyScalar(PLANET_RADIUS);
            var offset = terrainHeight(vertex.x, vertex.y, vertex.z);
            var newLength = PLANET_RADIUS + offset;
            var transform = newLength / PLANET_RADIUS;
            vertex.setX(vertex.x * transform);
            vertex.setY(vertex.y * transform);
            vertex.setZ(vertex.z * transform);
        }
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();

        geometry.verticesNeedUpdate = true;
        geometry.normalsNeedUpdate = true;*/

        //var q = new THREE.Quaternion().setFromAxisAngle( sunAxis, .1 );
        //sun.rotation.setEulerFromQuaternion( q );
        //light.rotation.setEulerFromQuaternion( q );
        //edges.update();
        controls.update(delta);

        controls.movementSpeed = 15+planet.nearestDistance/1;

        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function ly_to_m(ly) {
    return ly * 9.4605284 * Math.pow(10, 15)
};


function initPlanet(scene)
{
    /*var boundaries = [];
    for (var i = 26; i >= 13; --i)
    {
        boundaries.push(Math.pow(1.90, i));
    }*/
    boundaries = [
        PLANET_RADIUS*200, 
        PLANET_RADIUS*100, 
        PLANET_RADIUS*80,
        PLANET_RADIUS*1.2]
    for (var i = 1; i < 14; ++i)
    {
        boundaries.push(PLANET_RADIUS/Math.pow(2, i));
    }
    var material = new THREE.MeshPhongMaterial({
        color: PLANET_COLOR,
        shininess: .0001,
        shading: THREE.SmoothShading,
        wireframe: true
    });
    var tree = new IcosahedronTree.IcosahedronTree(PLANET_RADIUS,
        boundaries, 
        terrainHeight,
        material);

    return tree;
}

function initLight(scene)
{
    var sunRadius = 695800000;
    var sunDistance = 227900000000;
    var sunColor = 0xFFE95C;
    var lightColor = 0xFFFFFF;
    var ambientColor = 0x202020;
    var lightIntensity = 1;
    var lightPos = new THREE.Vector3(15, 4, 15).normalize().multiplyScalar(sunDistance);

    var sunGeometry = new THREE.SphereGeometry(sunRadius);
    var sunMaterial = new THREE.MeshBasicMaterial({
        color: sunColor,
        /*wireframe: true*/
    });
    var sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.copy(lightPos);

    var sunlight = new THREE.PointLight(lightColor, lightIntensity);
    sunlight.position.copy(lightPos);

    var ambient = new THREE.AmbientLight(ambientColor);

    scene.add(sun);
    scene.add(sunlight);
    scene.add(ambient);

    return {
        sun: sun,
        sunlight: sunlight,
        ambient: ambient
    };
}

function initCamera()
{
    var VIEW_ANGLE = 45,
        ASPECT = window.innerWidth / window.innerHeight,
        NEAR = 0.01,
        FAR = ly_to_m((AVG_STAR_DIST + STAR_DIST_DEV)*2);

    var camera =
      new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
    camera.position.z = PLANET_RADIUS * 5;// + 1.5;
    var controls = new FlyControls(camera);

    controls.movementSpeed = CAMERA_SPEED;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = true;

    return controls;
}

function initStars(scene)
{
    var seed = .9230975;
    //var numStars = 3 * Math.pow(10, 11) + (Noise.stream(seed)*2-1) * Math.pow(1, 11);
    var numStars = 3 * Math.pow(10, 3) + (Noise.stream(seed)*2-1) * Math.pow(10, 3);
    var stars = [];
    var smallest_r = 167000000;
    var largest_r = 695500000 * 1500;
    var galaxy_radius_ly = 50000;

    for (var i = 0; i < numStars; ++i)
    {
        var d = ly_to_m(AVG_STAR_DIST + Noise.stream() * STAR_DIST_DEV);
        var x = (Noise.stream()*2-1);
        var y = (Noise.stream()*2-1);
        var z = (Noise.stream()*2-1);
        var radius = smallest_r + Noise.stream() * (largest_r - smallest_r);

        var starGeometry = new THREE.SphereGeometry(radius);
        var starMaterial = new THREE.MeshBasicMaterial({
            color: 0xFFFFFF
        });
        star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set(x, y, z).multiplyScalar(d);
        scene.add(star);
        stars.push(star);
    }

    return stars;
}

function terrainHeight(vertex, lod)
{
    vertex.normalize().multiplyScalar(PLANET_RADIUS);
    var x = vertex.x;
    var y = vertex.y;
    var z = vertex.z;
    var persistence = 2;
    var amplitudeOffset = 3;
    var frequencyOffset = 5;
    var max_amplitude = Math.log(10000) / Math.log(persistence);
    var detail = 1.5*(lod + 2);
    
    height = 0;

    for (var i = 0; i < detail; ++i)
    {
        var d = max_amplitude - i;
        var amplitude = Math.pow(persistence, d + amplitudeOffset);
        var frequency = Math.pow(persistence, d + frequencyOffset)
        var noise = Noise.noise3d(x / frequency, y / frequency, z / frequency);
        height += amplitude * noise;
    }
    var newLength = PLANET_RADIUS + height;
    var transform = newLength / PLANET_RADIUS;
    vertex.setX(vertex.x * transform);
    vertex.setY(vertex.y * transform);
    vertex.setZ(vertex.z * transform);
}



