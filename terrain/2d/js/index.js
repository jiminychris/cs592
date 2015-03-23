var THREE = require('three');
var $ = require('jquery');
var FlyControls = require('./FlyControls');

function main()
{
    var mode = 0;
    var NUM_MODES = 2;
    var clock = new THREE.Clock();
    var timer = new THREE.Clock(false);
    // set up the plane vars
    var planeWidth = 20;
    var planeHeight = planeWidth;
    var segments = planeWidth * 10;

    var VIEW_ANGLE = 45,
        ASPECT = window.innerWidth / window.innerHeight,
        NEAR = 0.1,
        FAR = 10000;

    var scene = new THREE.Scene();
    var camera =
      new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
    var controls = new FlyControls(camera);

    controls.movementSpeed = 1;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 6;
    controls.autoForward = false;
    controls.dragToLook = true;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segments, segments);
    var material = new THREE.MeshPhongMaterial({
        color: 0xEDD46D,
        /*wireframe: true*/
    });

    for (var i = 0; i < geometry.vertices.length; ++i)
    {
        var vertex = geometry.vertices[i];
        var noise = noise3d(0.25*vertex.x, 0.25*vertex.y, 0.0)
            + 0.5 * noise3d(0.5*vertex.x, 0.5*vertex.y, 0.0)
            + 0.25      * noise3d(vertex.x, vertex.y, 0.0)
            + 0.125     * noise3d(2*vertex.x, 2*vertex.y, 0.0);
        vertex.z = noise;
    }
    var plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = -Math.PI / 2.0;

    var light = new THREE.PointLight(0xFFFFFF, 4, 0);
    light.position.set(15, 4, 15);

    scene.add(plane);
    scene.add(light);

    camera.position.z = 10;
    camera.position.y = 1.5;

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
                material.color.setHex(0xEDD46D);

                for (var i = 0; i < geometry.vertices.length; ++i)
                {
                    var vertex = geometry.vertices[i];
                    var noise = noise3d(0.25*vertex.x, 0.25*vertex.y, 0.0)
                        + 0.5   * noise3d(0.5*vertex.x, 0.5*vertex.y, 0.0)
                        + 0.25  * noise3d(vertex.x, vertex.y, 0.0)
                        + 0.125 * noise3d(2*vertex.x, 2*vertex.y, 0.0);
                    vertex.z = noise;
                }
                material.needsUpdate = true;
                geometry.verticesNeedUpdate = true;
            }
            else if (mode == 1)
            {
                timer.start();
                material.color.setHex(0x19CFE3);
                material.needsUpdate = true;
            }
        }
    });

    var frame = 0;
    function update()
    {

        var delta = clock.getDelta();
        var elapsedTime = timer.getElapsedTime();
        for (var i = 0; i < geometry.vertices.length; ++i)
        {
            var vertex = geometry.vertices[i];
            var noise = 4.0      * noise3d(0.03125*vertex.x, 0.03125*vertex.y, 0.03125*elapsedTime)
                      + 1.0     * noise3d(0.125*vertex.x, 0.125*vertex.y, 0.125*elapsedTime)
                      + 0.25   * noise3d(0.5*vertex.x, 0.5*vertex.y, 0.5*elapsedTime)
                      + 0.0625 * noise3d(2.0*vertex.x, 2.0*vertex.y, 2.0*elapsedTime);
            vertex.z = noise;
        }
        if (mode == 1)
        {
            geometry.verticesNeedUpdate = true;
        }
        controls.update(delta);
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

$(document).ready(function() {
    main();
});


var permutation = [
    151,160,137, 91, 90, 15,131, 13,201, 95, 96, 53,194,233,  7,225,140, 36,
    103, 30, 69,142,  8, 99, 37,240, 21, 10, 23,190,  6,148,247,120,234, 75,
      0, 26,197, 62, 94,252,219,203,117, 35, 11, 32, 57,177, 33, 88,237,149,
     56, 87,174, 20,125,136,171,168, 68,175, 74,165, 71,134,139, 48, 27,166,
     77,146,158,231, 83,111,229,122, 60,211,133,230,220,105, 92, 41, 55, 46,
    245, 40,244,102,143, 54, 65, 25, 63,161,  1,216, 80, 73,209, 76,132,187,
    208, 89, 18,169,200,196,135,130,116,188,159, 86,164,100,109,198,173,186,
      3, 64, 52,217,226,250,124,123,  5,202, 38,147,118,126,255, 82, 85,212,
    207,206, 59,227, 47, 16, 58, 17,182,189, 28, 42,223,183,170,213,119,248,
    152,  2, 44,154,163, 70,221,153,101,155,167, 43,172,  9,129, 22, 39,253,
     19, 98,108,110, 79,113,224,232,178,185,112,104,218,246, 97,228,251, 34,
    242,193,238,210,144, 12,191,179,162,241, 81, 51,145,235,249, 14,239,107,
     49,192,214, 31,181,199,106,157,184, 84,204,176,115,121, 50, 45,127,  4,
    150,254,138,236,205, 93,222,114, 67, 29, 24, 72,243,141,128,195, 78, 66,
    215, 61,156,180
];
var p = [];
for (var i=0; i < 256*2 ; i++)
{
    p.push(permutation[i % 256]);
}

function noise3d(x, y, z) {
    var X = Math.floor(x) & 255,                  // FIND UNIT CUBE THAT
        Y = Math.floor(y) & 255,                  // CONTAINS POINT.
        Z = Math.floor(z) & 255;
    x -= Math.floor(x);                                // FIND RELATIVE X,Y,Z
    y -= Math.floor(y);                                // OF POINT IN CUBE.
    z -= Math.floor(z);
    var u = fade(x),                                // COMPUTE FADE CURVES
        v = fade(y),                                // FOR EACH OF X,Y,Z.
        w = fade(z);
    var A = p[X  ]+Y, AA = p[A]+Z, AB = p[A+1]+Z,      // HASH COORDINATES OF
        B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;      // THE 8 CUBE CORNERS,

    return lerp(w, lerp(v, lerp(u, grad(p[AA  ], x  , y  , z   ),  // AND ADD
                                 grad(p[BA  ], x-1, y  , z   )), // BLENDED
                         lerp(u, grad(p[AB  ], x  , y-1, z   ),  // RESULTS
                                 grad(p[BB  ], x-1, y-1, z   ))),// FROM  8
                 lerp(v, lerp(u, grad(p[AA+1], x  , y  , z-1 ),  // CORNERS
                                 grad(p[BA+1], x-1, y  , z-1 )), // OF CUBE
                         lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                                 grad(p[BB+1], x-1, y-1, z-1 ))));
}
function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(t, a, b) { return a + t * (b - a); }
function grad(hash, x, y, z) {
    var h = hash & 15;                      // CONVERT LO 4 BITS OF HASH CODE
    var u = h<8 ? x : y,                 // INTO 12 GRADIENT DIRECTIONS.
        v = h<4 ? y : h==12||h==14 ? x : z;
    return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
}

