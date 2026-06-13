import * as THREE from 'three';

export function initDottedSurface() {
  const container = document.getElementById('dotted-surface');
  if (!container) return;

  const SEPARATION = 150;
  const AMOUNTX = 40;
  const AMOUNTY = 60;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 2000, 10000);

  let width = container.clientWidth;
  let height = container.clientHeight;

  const camera = new THREE.PerspectiveCamera(60, width / height, 1, 10000);
  camera.position.set(0, 355, 1220);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);

  const canvas = renderer.domElement;
  canvas.className = 'dotted__webgl';
  container.appendChild(canvas);

  const positions = [];
  const colors = [];

  for (let ix = 0; ix < AMOUNTX; ix++) {
    for (let iy = 0; iy < AMOUNTY; iy++) {
      const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
      const y = 0;
      const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;
      positions.push(x, y, z);
      colors.push(200 / 255, 200 / 255, 200 / 255);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 8,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let count = 0;
  let animationId = 0;
  let visible = true;

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    if (!visible) return;

    const positionAttribute = geometry.attributes.position;
    const arr = positionAttribute.array;

    let i = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
      for (let iy = 0; iy < AMOUNTY; iy++) {
        const index = i * 3;
        arr[index + 1] =
          Math.sin((ix + count) * 0.3) * 50 +
          Math.sin((iy + count) * 0.5) * 50;
        i++;
      }
    }

    positionAttribute.needsUpdate = true;
    renderer.render(scene, camera);
    count += 0.025;
  };

  const handleResize = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
    },
    { threshold: 0.05 },
  );
  observer.observe(container);

  window.addEventListener('resize', handleResize);
  animate();

  return () => {
    window.removeEventListener('resize', handleResize);
    observer.disconnect();
    cancelAnimationFrame(animationId);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
    if (canvas.parentNode === container) container.removeChild(canvas);
  };
}

initDottedSurface();
