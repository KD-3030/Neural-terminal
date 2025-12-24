export const grainVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const grainFragmentShader = `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec2 uResolution;
  varying vec2 vUv;
  
  // Noise function
  float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Film grain
    float noise = random(uv + uTime * 0.01) * uIntensity;
    
    // Scanlines
    float scanline = sin(uv.y * uResolution.y * 1.5) * 0.02;
    
    // Vignette
    float vignette = 1.0 - smoothstep(0.4, 0.9, length(uv - 0.5));
    
    // Combine effects
    float grain = noise + scanline;
    
    gl_FragColor = vec4(vec3(grain), grain * vignette * 0.15);
  }
`

export const chromaticAberrationShader = `
  uniform sampler2D tDiffuse;
  uniform float uOffset;
  uniform float uTime;
  varying vec2 vUv;
  
  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5);
    vec2 dir = uv - center;
    float dist = length(dir);
    
    // Dynamic offset based on distance from center
    float offset = uOffset * dist * (1.0 + sin(uTime * 2.0) * 0.1);
    
    // Sample with chromatic aberration
    float r = texture2D(tDiffuse, uv + dir * offset).r;
    float g = texture2D(tDiffuse, uv).g;
    float b = texture2D(tDiffuse, uv - dir * offset).b;
    
    gl_FragColor = vec4(r, g, b, 1.0);
  }
`

export const glitchShader = `
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uIntensity;
  uniform float uGlitchAmount;
  varying vec2 vUv;
  
  float random(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec2 uv = vUv;
    
    // Random glitch blocks
    float glitchLine = step(0.99 - uGlitchAmount * 0.1, random(vec2(floor(uv.y * 50.0), uTime)));
    
    // Horizontal displacement
    float displacement = (random(vec2(uTime, floor(uv.y * 20.0))) - 0.5) * 0.1 * uIntensity * glitchLine;
    
    // Color channel separation during glitch
    vec2 offsetUv = uv + vec2(displacement, 0.0);
    
    vec4 color;
    if (glitchLine > 0.5) {
      color.r = texture2D(tDiffuse, offsetUv + vec2(0.01 * uIntensity, 0.0)).r;
      color.g = texture2D(tDiffuse, offsetUv).g;
      color.b = texture2D(tDiffuse, offsetUv - vec2(0.01 * uIntensity, 0.0)).b;
      color.a = 1.0;
    } else {
      color = texture2D(tDiffuse, uv);
    }
    
    gl_FragColor = color;
  }
`
