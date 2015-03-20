// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

varying vec3 vNormal;
varying vec3 vPosition;
uniform int p[512];

void main() {
    vNormal = normal;
    vPosition = position;

    gl_Position = projectionMatrix *
                modelViewMatrix *
                vec4(position,1.0);
}