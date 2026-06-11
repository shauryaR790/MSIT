import * as THREE from 'three';

const VS = `
  varying vec2 vUv;
  varying float vElevation;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * 3.0 + uTime) *
                      sin(modelPosition.z * 2.0 + uTime * 0.5) * 0.4;

    modelPosition.y += elevation;
    vElevation = elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
  }
`;

const FS = `
  varying vec2 vUv;
  varying float vElevation;

  float dither(vec2 position, float brightness) {
    int x = int(mod(position.x, 4.0));
    int y = int(mod(position.y, 4.0));
    int index = x + y * 4;
    float limit = 0.0;

    if (index == 0) limit = 0.0625;
    if (index == 8) limit = 0.5625;
    if (index == 2) limit = 0.1875;
    if (index == 10) limit = 0.6875;
    if (index == 12) limit = 0.8125;
    if (index == 4) limit = 0.3125;
    if (index == 14) limit = 0.9375;
    if (index == 6) limit = 0.4375;
    if (index == 3) limit = 0.25;
    if (index == 11) limit = 0.75;
    if (index == 1) limit = 0.125;
    if (index == 9) limit = 0.625;
    if (index == 15) limit = 1.0;
    if (index == 7) limit = 0.5;
    if (index == 13) limit = 0.875;
    if (index == 5) limit = 0.375;

    return brightness < limit ? 0.0 : 1.0;
  }

  void main() {
    float light = vElevation * 2.0 + 0.5;
    float scanline = sin(vUv.y * 800.0) * 0.1;
    light += scanline;

    vec2 screenPos = gl_FragCoord.xy / 2.0;
    float finalColor = dither(screenPos, light);
    vec3 color = mix(vec3(0.96), vec3(0.1), finalColor);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const container = document.getElementById('sonoscan-canvas');
if (container) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.offsetWidth / container.offsetHeight,
    0.1,
    100
  );
  camera.position.set(1.5, 1.5, 1.5);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const geometry = new THREE.PlaneGeometry(3, 3, 128, 128);
  geometry.rotateX(-Math.PI * 0.5);

  const material = new THREE.ShaderMaterial({
    vertexShader: VS,
    fragmentShader: FS,
    uniforms: {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(container.offsetWidth, container.offsetHeight) },
    },
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const grid = new THREE.GridHelper(3, 30, 0x444444, 0x222222);
  grid.position.y = -0.41;
  scene.add(grid);

  const clock = new THREE.Clock();

  function animate() {
    const elapsedTime = clock.getElapsedTime();
    material.uniforms.uTime.value = elapsedTime * 0.5;
    mesh.rotation.y = Math.sin(elapsedTime * 0.2) * 0.1;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    material.uniforms.uResolution.value.set(container.offsetWidth, container.offsetHeight);
  });

  window.addEventListener('mousemove', (e) => {
    const targetX = (e.clientX / window.innerWidth - 0.5) * 0.5;
    const targetY = (e.clientY / window.innerHeight - 0.5) * 0.5;
    camera.position.x += (targetX + 1.5 - camera.position.x) * 0.05;
    camera.position.y += (targetY + 1.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
}
