// ============================================================
//  3D scene: DNA double helix (hero) + molecular network + particles
//  Three.js via importmap. Degrades gracefully; respects reduced motion.
// ============================================================
// THREE is loaded globally via the three.min.js script tag in index.html
function initScene(canvas) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const renderer = new THREE.WebGLRenderer({
    canvas, antialias: true, alpha: true, powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  // use physically-correct lighting so the intensities below look identical
  // across three.js versions (r150 still defaults to legacy lights)
  if ("useLegacyLights" in renderer) renderer.useLegacyLights = false;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0e17, 0.05);  // stronger depth-of-field fade

  const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 16);

  // ---- lights ----
  scene.add(new THREE.AmbientLight(0x334155, 1.4));
  const key = new THREE.PointLight(0x00d4aa, 60, 60);
  key.position.set(-8, 6, 10); scene.add(key);
  const rim = new THREE.PointLight(0xff6b9d, 40, 60);
  rim.position.set(10, -4, 6); scene.add(rim);

  const TEAL = new THREE.Color(0x00d4aa);
  const MAGENTA = new THREE.Color(0xff6b9d);
  const AMBER = new THREE.Color(0xf4a261);

  // ================= DNA DOUBLE HELIX (realistic) =================
  // Two smooth sugar-phosphate backbones (tubes) + base-pair rungs with
  // nucleotide beads. A-T rungs cyan, G-C rungs magenta.
  const helix = new THREE.Group();
  scene.add(helix);

  const RUNGS = reduce ? 24 : 40;
  const RADIUS = 2.1;
  const TURN = 0.42;       // radians between rungs (smaller = looser coil)
  const RISE = 0.5;        // vertical spacing between base pairs
  const height = (RUNGS - 1) * RISE;

  const strandA = new THREE.Group();   // backbone tube + beads, one strand
  const strandB = new THREE.Group();   // the complementary strand
  const rungGroup = new THREE.Group(); // base pairs
  helix.add(strandA, strandB, rungGroup);

  // build a smooth curve of points for one backbone
  function backbonePoints(phase) {
    const pts = [];
    const sub = 6; // sub-samples between rungs → smooth tube
    for (let i = 0; i <= (RUNGS - 1) * sub; i++) {
      const t = i / sub;
      const ang = t * TURN + phase;
      const y = t * RISE - height / 2;
      pts.push(new THREE.Vector3(Math.cos(ang) * RADIUS, y, Math.sin(ang) * RADIUS));
    }
    return pts;
  }
  const BACKBONE_OPACITY = 0.62;
  const backboneMat = new THREE.MeshStandardMaterial({
    color: 0x6fd8c8, emissive: 0x0a4d42, emissiveIntensity: 0.35,
    roughness: 0.3, metalness: 0.35, transparent: true, opacity: BACKBONE_OPACITY,
  });
  const tubeSeg = (RUNGS - 1) * 6;
  const tubeA = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(backbonePoints(0)), tubeSeg, 0.10, 12, false), backboneMat);
  const tubeB = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(backbonePoints(Math.PI)), tubeSeg, 0.10, 12, false), backboneMat);
  strandA.add(tubeA);
  strandB.add(tubeB);

  // base pairs: two half-rods meeting in the middle + beads on each strand
  const beadGeo = new THREE.SphereGeometry(0.14, 16, 16);
  const rodGeo = new THREE.CylinderGeometry(0.045, 0.045, RADIUS, 10); // length ≈ half-rung
  const matTeal = new THREE.MeshStandardMaterial({ color: TEAL, emissive: TEAL, emissiveIntensity: 0.55, roughness: 0.35, transparent: true, opacity: 0.92 });
  const matMag = new THREE.MeshStandardMaterial({ color: MAGENTA, emissive: MAGENTA, emissiveIntensity: 0.55, roughness: 0.35, transparent: true, opacity: 0.92 });
  const Y_AXIS = new THREE.Vector3(0, 1, 0);

  const rungMeta = [];
  for (let i = 0; i < RUNGS; i++) {
    const y = i * RISE - height / 2;
    const ang = i * TURN;
    const mat = i % 2 === 0 ? matTeal : matMag;
    const ax = Math.cos(ang) * RADIUS, az = Math.sin(ang) * RADIUS;

    const beadA = new THREE.Mesh(beadGeo, mat); beadA.position.set(ax, y, az); strandA.add(beadA);
    const beadB = new THREE.Mesh(beadGeo, mat); beadB.position.set(-ax, y, -az); strandB.add(beadB);

    const rodA = new THREE.Mesh(rodGeo, mat.clone()); rodA.material.transparent = true;
    const rodB = new THREE.Mesh(rodGeo, mat.clone()); rodB.material.transparent = true;
    rungGroup.add(rodA, rodB);
    rungMeta.push({ ax, az, y, rodA, rodB });
  }

  const _from = new THREE.Vector3(), _to = new THREE.Vector3(), _mid = new THREE.Vector3(), _dir = new THREE.Vector3();
  function orientRod(rod, from, to) {
    _mid.copy(from).add(to).multiplyScalar(0.5); rod.position.copy(_mid);
    _dir.copy(to).sub(from); const len = _dir.length();
    rod.scale.y = len / RADIUS;
    rod.quaternion.setFromUnitVectors(Y_AXIS, _dir.normalize());
  }

  function layoutHelix(unzip) {
    // unzip 0..1: strands slide apart along x, rungs stretch and fade
    const sep = unzip * 2.6;
    strandA.position.x = -sep;
    strandB.position.x = sep;
    const op = Math.max(0, 1 - unzip * 1.5);
    for (let i = 0; i < RUNGS; i++) {
      const r = rungMeta[i];
      _from.set(r.ax - sep, r.y, r.az);            // strand-A attach
      _to.set(-r.ax + sep, r.y, -r.az);            // strand-B attach
      _mid.copy(_from).add(_to).multiplyScalar(0.5);
      orientRod(r.rodA, _from, _mid);
      orientRod(r.rodB, _mid, _to);
      r.rodA.material.opacity = op; r.rodB.material.opacity = op;
    }
  }
  layoutHelix(0);

  // resting pose: shifted to the right & scaled down so the hero text stays
  // clear on the left and the helix reads as a backdrop behind the portrait
  const HERO_X = 4.6, HERO_Y = 0.2, HERO_SCALE = 0.74;
  helix.position.set(HERO_X, HERO_Y, 0);
  helix.scale.setScalar(HERO_SCALE);

  // ================= MOLECULAR NETWORK (background) =================
  const net = new THREE.Group();
  net.position.set(9, -1, -8);
  scene.add(net);
  const NODES = reduce ? 14 : 26;
  const nodePos = [];
  const nodeGeo = new THREE.SphereGeometry(0.14, 12, 12);
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0x00d4aa, emissive: 0x00d4aa, emissiveIntensity: 0.6, roughness: 0.4 });
  const netNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, NODES);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < NODES; i++) {
    const p = new THREE.Vector3(
      (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 8);
    nodePos.push(p);
    dummy.position.copy(p); dummy.scale.setScalar(0.6 + Math.random()); dummy.updateMatrix();
    netNodes.setMatrixAt(i, dummy.matrix);
  }
  netNodes.instanceMatrix.needsUpdate = true;
  net.add(netNodes);
  // edges
  const edgePts = [];
  for (let i = 0; i < NODES; i++)
    for (let j = i + 1; j < NODES; j++)
      if (nodePos[i].distanceTo(nodePos[j]) < 4.2 && Math.random() > 0.4)
        edgePts.push(nodePos[i], nodePos[j]);
  const edgeGeo = new THREE.BufferGeometry().setFromPoints(edgePts);
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x2a3a52, transparent: true, opacity: 0.5 }));
  net.add(edges);

  // ================= FLOATING PARTICLES (nucleotides) =================
  const PCOUNT = reduce ? 120 : 340;
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(PCOUNT * 3);
  const pCol = new Float32Array(PCOUNT * 3);
  const palette = [TEAL, MAGENTA, AMBER];
  for (let i = 0; i < PCOUNT; i++) {
    pPos[i * 3] = (Math.random() - 0.5) * 40;
    pPos[i * 3 + 1] = (Math.random() - 0.5) * 30;
    pPos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 4;
    const c = palette[(Math.random() * 3) | 0];
    pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  pGeo.setAttribute("color", new THREE.BufferAttribute(pCol, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
    size: 0.09, vertexColors: true, transparent: true, opacity: 0.8, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  scene.add(particles);

  // ================= interaction state =================
  const state = { mx: 0, my: 0, tmx: 0, tmy: 0, scroll: 0, unzip: 0, paused: reduce, heroFocus: 1 };

  window.addEventListener("pointermove", (e) => {
    state.tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    state.tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const clock = new THREE.Clock();
  function render() {
    const t = clock.getElapsedTime();
    // smooth mouse
    state.mx += (state.tmx - state.mx) * 0.05;
    state.my += (state.tmy - state.my) * 0.05;

    if (!state.paused) {
      helix.rotation.y = t * 0.1 + state.mx * 0.4;
      helix.rotation.x = state.my * 0.18;
      helix.rotation.z = Math.sin(t * 0.15) * 0.04;
      net.rotation.y = t * 0.05;
      net.rotation.x = t * 0.03;
      particles.rotation.y = t * 0.02;
    }
    // camera parallax
    camera.position.x += (state.mx * 1.4 - camera.position.x) * 0.04;
    camera.position.y += (-state.my * 1.0 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();

  // ---- public API for the scroll controller ----
  return {
    setUnzip(v) { state.unzip = v; layoutHelix(v); },
    // move helix off to the side / fade as we leave hero (0 = full hero, 1 = gone)
    setHeroProgress(p) {
      helix.position.x = HERO_X + p * 3.5;   // drift further right as it leaves
      helix.position.y = HERO_Y + p * 3;
      helix.scale.setScalar(HERO_SCALE * (1 - p * 0.3));
      const op = 1 - p * 0.85;
      backboneMat.opacity = BACKBONE_OPACITY * op;
      helix.visible = op > 0.05;
    },
    setPaused(v) { state.paused = v; },
    isPaused() { return state.paused; },
  };
}
