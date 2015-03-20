var THREE = require('three');
var $ = require('jquery');

function main(vShader, fShader)
{
    // set up the sphere vars
    var planeWidth = 100;
    var planeHeight = planeWidth;

    var VIEW_ANGLE = 45,
        ASPECT = window.innerWidth / window.innerHeight,
        NEAR = 0.1,
        FAR = 1000;

    var attributes = {
    };

    var uniforms = {
    };

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

    var geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
    var material =
      new THREE.ShaderMaterial({
        uniforms:       uniforms,
        attributes:     attributes,
        vertexShader:   vShader,
        fragmentShader: fShader
      });
    var plane = new THREE.Mesh( geometry, material );

    scene.add( plane );

    camera.position.z = 300;

    var frame = 0;
    function update()
    {
        renderer.render(scene, camera);
        requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
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

