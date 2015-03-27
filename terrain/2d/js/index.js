var THREE = require('three');
var $ = require('jquery');
var FlyControls = require('./FlyControls');
var Noise = require('./Noise');

function main()
{
    var mode = 0;
    var NUM_MODES = 2;
    var clock = new THREE.Clock();
    var timer = new THREE.Clock(false);

    var scene = new THREE.Scene();

    var plane = initPlane(scene);
    var light = initLight(scene);
    var controls = initCamera(scene);
    var camera = controls.object;


    var renderer = new THREE.WebGLRenderer();
    //renderer.shadowMapEnabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

    //var edges = new THREE.VertexNormalsHelper(plane, 2, 0x00ff00, 1);
    //scene.add(edges);

    $(window).keypress(function(e)
    {
        if (e.keyCode == 32)
        {
            mode += 1;
            if (mode == NUM_MODES)
                mode = 0;
            if (mode == 0)
            {
                timer.stop();
                plane.material.color.setHex(0xEDD46D);
                //material.needsUpdate = true;
            }
            else if (mode == 1)
            {
                timer.start();
                plane.material.color.setHex(0x19CFE3);
                //material.needsUpdate = true;
            }
        }
    });

    function update()
    {
        var geometry = plane.geometry;
        var delta = clock.getDelta();
        var elapsedTime = timer.getElapsedTime();
        for (var i = 0; i < geometry.vertices.length; ++i)
        {
            var vertex = geometry.vertices[i];
            vertex.setZ(terrainHeight(vertex.x, vertex.y, elapsedTime));
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

function initPlane(scene)
{
    var planeWidth = 10;
    var planeHeight = planeWidth;
    var segments = planeWidth*5;

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segments, segments);
    var material = new THREE.MeshPhongMaterial({
        color: 0xEDD46D,
        shininess: .0001,
        shading: THREE.SmoothShading
        /*wireframe: true*/
    });

    var plane = new THREE.Mesh(geometry, material);
    //plane.castShadow = true;
    //plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2.0;

    scene.add(plane);

    return plane;
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
    camera.position.z = 10;
    camera.position.y = 1.5;
    var controls = new FlyControls(camera);

    controls.movementSpeed = 1;
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
    return Math.pow(3, height);
}

$(document).ready(function() {
    main();
});