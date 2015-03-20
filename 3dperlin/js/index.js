var THREE = require('three');
var $ = require('jquery');
var FlyControls = require('./FlyControls');

function main(vShader, fShader)
{
    var clock = new THREE.Clock();
    // set up the sphere vars
    var radius = 20,
        segments = 40,
        rings = 40;

    var VIEW_ANGLE = 45,
        ASPECT = window.innerWidth / window.innerHeight,
        NEAR = 0.1,
        FAR = 10000;

    var attributes = {
    };

    var uniforms = {
        mode: {
            type: 'i',
            value: 0
        }
    };
    NUM_MODES = 2;

    var shaderMaterial =
      new THREE.ShaderMaterial({
        uniforms:       uniforms,
        attributes:     attributes,
        vertexShader:   vShader,
        fragmentShader: fShader
      });

    var scene = new THREE.Scene();
    var camera =
      new THREE.PerspectiveCamera(
        VIEW_ANGLE,
        ASPECT,
        NEAR,
        FAR);
    var controls = new FlyControls(camera);

    controls.movementSpeed = 50;
    controls.domElement = container;
    controls.rollSpeed = Math.PI / 12;
    controls.autoForward = false;
    controls.dragToLook = false;

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = shaderMaterial; //new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var sphere = new THREE.Mesh( geometry, material );

    scene.add( sphere );


    // the camera starts at 0,0,0
    // so pull it back
    camera.position.z = 60;

    $(window).keypress(function(e)
    {
        if (e.keyCode == 32)
        {
            uniforms.mode.value += 1;
            if (uniforms.mode.value == NUM_MODES)
                uniforms.mode.value = 0;
        }
        /*else if (e.keyCode == 119)
        {
            camera.position.z -= 1.0;
            camera.updateMatrix();
        }
        else if (e.keyCode == 115)
        {
            camera.position.z += 1.0;
            camera.updateMatrix();
        }
        else if (e.keyCode == 97)
        {
            camera.position.x -= 1.0;
            camera.updateMatrix();
        }
        else if (e.keyCode == 100)
        {
            camera.position.x += 1.0;
            camera.updateMatrix();
        }
        else if (e.keyCode == 106)
        {
            camera.rotation.y -= 0.1;
            camera.updateMatrix();
        }
        else if (e.keyCode == 108)
        {
            camera.rotation.y += 0.1;
            camera.updateMatrix();
        }*/
    });

    var frame = 0;
    function update()
    {
        var delta = clock.getDelta();
        controls.update(delta);
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
    

    /*function render() {
        requestAnimationFrame( render );
        cube.rotation.x += 0.1;
        cube.rotation.y += 0.1;
        renderer.render( scene, camera );
    }
    render();*/
}

$(document).ready(function() {
    $.ajax({
        url: $('#vertexshader').attr('src'),
        success: function(vShader) {
            $.ajax({
                url: $('#fragmentshader').attr('src'),
                success: function(fShader) {
                    main(vShader, fShader);
                }
            });
        }
    });
});

