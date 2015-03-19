var THREE = require('three');
var $ = require('jquery');

function main(vShader, fShader)
{
    // set up the sphere vars
    var radius = 100,
        segments = 16,
        rings = 16;

    var VIEW_ANGLE = 45,
        ASPECT = window.innerWidth / window.innerHeight,
        NEAR = 0.1,
        FAR = 10000;

    var attributes = {
    };

    var uniforms = {
    }

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

    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    var geometry = new THREE.SphereGeometry(radius, segments, rings);
    var material = shaderMaterial; //new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var sphere = new THREE.Mesh( geometry, material );

    scene.add( sphere );


    // the camera starts at 0,0,0
    // so pull it back
    camera.position.z = 300;

    var frame = 0;
    function update()
    {
        frame += 0.1;
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

