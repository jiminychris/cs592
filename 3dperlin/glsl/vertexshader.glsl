// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
    vNormal = normal;
    vPosition = position;

    gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}