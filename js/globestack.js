import * as THREE from 'three';
import * as Pretext from 'pretext';

const FONT_SPEC = "11px 'Space Mono', 'Courier New', monospace";
const LINE_HEIGHT = 12;
const MASK_RESOLUTION = 256;

const sourceText = `GLOBAL COLLAB: ACTIVE. REMOTE BUILD SESSIONS: NOMINAL. TIMEZONE HANDOFFS: IST UTC PST CET. FULL STACK DELIVERY: SHIPPED. UI/UX REVIEWS: CROSS BORDER. CYBER LABS: SHARED ACCESS. CLIENT SYNC: REMOTE. OPEN SOURCE: CONTRIBUTED. DESIGN CRITS: GLOBAL. DEPLOY PIPELINE: LIVE. SHAURYA RAJPUT: INDIA REMOTE. `.repeat(120);

const ORBIT_LINES = [
  { radiusMul: 1.32, opacity: 0.55, lineWidth: 1.5 },
  { radiusMul: 1.58, opacity: 0.4, lineWidth: 1.5 },
];


function getOffset(container, e) {
  const rect = container.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

export function initGlobestack() {
  const container = document.getElementById('globestack-stage');
  const webglCanvas = document.getElementById('globestack-webgl');
  const pretextCanvas = document.getElementById('globestack-pretext');

  if (!container || !webglCanvas || !pretextCanvas) return;

  const ctx2d = pretextCanvas.getContext('2d');
  let width = container.clientWidth;
  let height = container.clientHeight;
  let running = true;
  let rafId = 0;

  const renderer = new THREE.WebGLRenderer({ canvas: webglCanvas, antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.z = 4.6;

  const maskScene = new THREE.Scene();
  const maskRenderTarget = new THREE.WebGLRenderTarget(MASK_RESOLUTION, MASK_RESOLUTION);
  const maskPixels = new Uint8Array(MASK_RESOLUTION * MASK_RESOLUTION * 4);

  const textureLoader = new THREE.TextureLoader();
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const earthGroup = new THREE.Group();
  // Asia-Pacific view � India left, Australia bottom (matches default frame)
  const START_LNG = 128;
  const START_LAT = 6;
  earthGroup.rotation.y = -(START_LNG * Math.PI) / 180;
  earthGroup.rotation.x = (START_LAT * Math.PI) / 180;
  scene.add(earthGroup);

  const waterMaskUrl = 'https://unpkg.com/three-globe/example/img/earth-water.png';

  const earthVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const earthFragmentShader = `
    uniform sampler2D waterMap;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main() {
      vec4 waterColor = texture2D(waterMap, vUv);
      bool isLand = waterColor.r < 0.5;
      vec3 lightDir = normalize(vec3(0.4, 0.65, 1.0));
      float diff = max(dot(normalize(vNormal), lightDir), 0.0);
      float shade = isLand ? (0.04 + diff * 0.14) : (0.82 + diff * 0.18);
      gl_FragColor = vec4(vec3(shade), 1.0);
    }
  `;

  const maskFragmentShader = `
    uniform sampler2D waterMap;
    varying vec2 vUv;
    void main() {
      vec4 waterColor = texture2D(waterMap, vUv);
      if (waterColor.r < 0.5) {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
      } else {
        gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
      }
    }
  `;

  let maskEarthMesh = null;
  let preparedText = null;

  textureLoader.load(waterMaskUrl, (waterMask) => {
    const earthMaterial = new THREE.ShaderMaterial({
      uniforms: { waterMap: { value: waterMask } },
      vertexShader: earthVertexShader,
      fragmentShader: earthFragmentShader,
    });
    earthGroup.add(new THREE.Mesh(geometry, earthMaterial));

    const maskMaterial = new THREE.ShaderMaterial({
      uniforms: { waterMap: { value: waterMask } },
      vertexShader: earthVertexShader,
      fragmentShader: maskFragmentShader,
    });
    maskEarthMesh = new THREE.Mesh(geometry, maskMaterial);
    maskEarthMesh.rotation.copy(earthGroup.rotation);
    maskScene.add(maskEarthMesh);

    preparedText = Pretext.prepareWithSegments(sourceText, FONT_SPEC);
    animate();
  });

  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let rotationVelocity = { x: 0.00015, y: 0.00035 };

  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousMousePosition = getOffset(container, e);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const pos = getOffset(container, e);
    const deltaMove = {
      x: pos.x - previousMousePosition.x,
      y: pos.y - previousMousePosition.y,
    };
    rotationVelocity.x = deltaMove.y * 0.003;
    rotationVelocity.y = deltaMove.x * 0.003;
    previousMousePosition = pos;
  });

  function strokeOrbit(cx, cy, orbit, radius) {
    ctx2d.save();
    ctx2d.strokeStyle = `rgba(255, 255, 255, ${orbit.opacity})`;
    ctx2d.lineWidth = orbit.lineWidth;
    ctx2d.lineCap = 'butt';
    ctx2d.beginPath();
    ctx2d.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx2d.stroke();
    ctx2d.restore();
  }

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.position.z = width <= 768 ? 3.35 : 4.6;
    camera.updateProjectionMatrix();
    pretextCanvas.width = width;
    pretextCanvas.height = height;
  }

  resize();
  window.addEventListener('resize', resize);

  const observer = new IntersectionObserver(
    (entries) => {
      running = entries[0]?.isIntersecting ?? true;
      if (running && maskEarthMesh && !rafId) animate();
    },
    { threshold: 0.08 }
  );
  observer.observe(container);

  function animate() {
    rafId = requestAnimationFrame(animate);
    if (!running || !maskEarthMesh || !preparedText) {
      if (!running) rafId = 0;
      return;
    }

    if (!isDragging) {
      rotationVelocity.x *= 0.95;
      rotationVelocity.y *= 0.95;
      if (Math.abs(rotationVelocity.y) < 0.00035) rotationVelocity.y = 0.00035;
    }

    earthGroup.rotation.x += rotationVelocity.x;
    earthGroup.rotation.y += rotationVelocity.y;
    maskEarthMesh.rotation.copy(earthGroup.rotation);

    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    renderer.setRenderTarget(maskRenderTarget);
    renderer.render(maskScene, camera);
    renderer.readRenderTargetPixels(maskRenderTarget, 0, 0, MASK_RESOLUTION, MASK_RESOLUTION, maskPixels);

    ctx2d.clearRect(0, 0, width, height);

    const fov = (camera.fov * Math.PI) / 180;
    const vHeight = 2 * Math.tan(fov / 2) * camera.position.z;
    const screenRadius = (1 / (vHeight / 2)) * (height / 2);
    const centerX = width / 2;
    const centerY = height / 2;
    const maxOrbitRadius = Math.min(centerX, centerY) - 12;
    ORBIT_LINES.forEach((orbit) => {
      const radius = Math.min(screenRadius * orbit.radiusMul, maxOrbitRadius);
      strokeOrbit(centerX, centerY, orbit, radius);
    });

    ctx2d.font = FONT_SPEC;
    ctx2d.fillStyle = 'rgba(255, 255, 255, 0.55)';
    ctx2d.textBaseline = 'top';
    ctx2d.textAlign = 'left';

    let cursor = { segmentIndex: 0, graphemeIndex: 0 };
    const scaleX = MASK_RESOLUTION / width;
    const scaleY = MASK_RESOLUTION / height;

    for (let y = 0; y < height; y += LINE_HEIGHT) {
      const maskY = Math.floor((height - 1 - y) * scaleY);
      if (maskY < 0 || maskY >= MASK_RESOLUTION) continue;

      let inLandSegment = false;
      let segmentStartX = 0;

      for (let x = 0; x < width; x += 2) {
        const maskX = Math.floor(x * scaleX);
        const idx = (maskY * MASK_RESOLUTION + maskX) * 4;
        const isLand = maskPixels[idx] > 128;

        if (isLand && !inLandSegment) {
          inLandSegment = true;
          segmentStartX = x;
        } else if (!isLand && inLandSegment) {
          inLandSegment = false;
          const segmentWidth = x - segmentStartX;
          if (segmentWidth > 15) {
            const line = Pretext.layoutNextLine(preparedText, cursor, segmentWidth);
            if (line) {
              ctx2d.fillText(line.text, segmentStartX, y);
              cursor = line.end;
            }
          }
        }
      }

      if (inLandSegment) {
        const segmentWidth = width - segmentStartX;
        if (segmentWidth > 15) {
          const line = Pretext.layoutNextLine(preparedText, cursor, segmentWidth);
          if (line) {
            ctx2d.fillText(line.text, segmentStartX, y);
            cursor = line.end;
          }
        }
      }
    }
  }
}

initGlobestack();
