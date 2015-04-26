var THREE = require('three');
var $ = require('jquery');
var FlyControls = require('./FlyControls');
var Noise = require('./Noise');

var PLANET_RADIUS = 6371000;
var CAMERA_SPEED = 1000000;

function main()
{
    var clock = new THREE.Clock();

    var scene = new THREE.Scene();

    var planet = initPlanet(scene);
    var light = initLight(scene);
    var controls = initCamera(scene);
    var camera = controls.object;


    var renderer = new THREE.WebGLRenderer();
    //renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    //var edges = new THREE.VertexNormalsHelper(planet, 2, 0x00ff00, 1);
    //scene.add(edges);

    function update()
    {
        var geometry = planet.geometry;
        var delta = clock.getDelta();
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
        geometry.normalsNeedUpdate = true;

        //var q = new THREE.Quaternion().setFromAxisAngle( sunAxis, .1 );
        //sun.rotation.setEulerFromQuaternion( q );
        //light.rotation.setEulerFromQuaternion( q );
        //edges.update();
        controls.update(delta);
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

function initPlanet(scene)
{
    var detail = 6;
    var geometry = new THREE.IcosahedronGeometry(PLANET_RADIUS, detail);
    var material = new THREE.MeshPhongMaterial({
        color: 0xEDD46D,
        shininess: .0001,
        shading: THREE.SmoothShading
        /*wireframe: true*/
    });

    var planet = new THREE.Mesh(geometry, material);

    scene.add(planet);

    return planet;
}

function initLight(scene)
{
    var sunRadius = 695800000;
    var sunDistance = 149600000000;
    var sunColor = 0xFFFFFF;
    var lightColor = 0xFFFFFF;
    var ambientColor = 0x202020;
    var lightIntensity = 1;
    var lightPos = new THREE.Vector3(15, 4, -15).normalize().multiplyScalar(sunDistance);

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
        NEAR = 0.1,
        FAR = 100000000000;

    var camera =
      new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
    camera.position.y = PLANET_RADIUS + 1.5;
    var controls = new FlyControls(camera);

    controls.movementSpeed = CAMERA_SPEED;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = true;

    return controls;
}

function terrainHeight(x, y, t)
{
    var persistence = 2;
    var amplitudeOffset = -2;
    var frequencyOffset = 1;
    var detail = 4;
    
    height = 0;

    for (var i = 0; i < detail; ++i)
    {
        var amplitude = Math.pow(persistence, i + amplitudeOffset);
        var frequency = Math.pow(persistence, i + frequencyOffset)
        var noise = Noise.noise3d(x / frequency, y / frequency, t / frequency);
        height += amplitude * noise;
    }
    return Math.pow(height * 18, 3);
}

$(document).ready(function() {
    main();
});

