// switch on high precision floats
#ifdef GL_ES
precision highp float;
#endif

// same name and type as VS
varying vec3 vNormal;

void main() {
  // calc the dot product and clamp
  // 0 -> 1 rather than -1 -> 1
  vec3 light = vec3(0.5, 0.2, 1.0);

  // ensure it's normalized
  light = normalize(light);

  // calculate the dot product of
  // the light to the vertex normal
  float dProd = max(0.0,
                    dot(vNormal, light));

  // feed into our frag colour
  gl_FragColor = vec4(0.0, // R
                      dProd, // G
                      0.0, // B
                      1.0);  // A
}