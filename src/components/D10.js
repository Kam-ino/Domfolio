import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

/**
 * D10 (Pentagonal Trapezohedron)
 * - Non-indexed geometry with individual face groups
 * - Rolls randomly, bounces once, then snaps so rolled face faces the camera
 * - Side 10 faces the camera initially
 */

const ROLL_DURATION_MS = 1800;
const GRAVITY = -9.8;
const BOUNCE_DAMPING = 0.5;

// ========== Helper: numbered face texture ==========
function makeNumberTexture(number, size = 256, bgcolor = "#4e342e", fg = "#fff") {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = bgcolor;
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = fg;
  ctx.font = `${Math.floor(size * 0.55)}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineWidth = Math.floor(size * 0.03);
  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.strokeText(String(number), size / 2, size / 2);
  ctx.fillText(String(number), size / 2, size / 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ========== Build pentagonal trapezohedron ==========
function makeD10Geometry() {
  const r1 = 1;
  const r2 = 1;
  const h = 0.7; // taper height
  const angleStep = (Math.PI * 2) / 5;

  const topVerts = [];
  const bottomVerts = [];
  for (let i = 0; i < 5; i++) {
    const angle = i * angleStep;
    const offset = i % 2 === 0 ? 0 : angleStep / 2;
    topVerts.push(new THREE.Vector3(Math.cos(angle + offset) * r1, h, Math.sin(angle + offset) * r1));
    bottomVerts.push(new THREE.Vector3(Math.cos(angle + offset) * r2, -h, Math.sin(angle + offset) * r2));
  }

  const verts = [];
  const faces = [];

  // upper faces
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    verts.push(topVerts[i], topVerts[next], new THREE.Vector3(0, 0, 0)); // approximate center
    faces.push([verts.length - 3, verts.length - 2, verts.length - 1]);
  }

  // lower faces
  for (let i = 0; i < 5; i++) {
    const next = (i + 1) % 5;
    verts.push(bottomVerts[next], bottomVerts[i], new THREE.Vector3(0, 0, 0)); // approximate center
    faces.push([verts.length - 3, verts.length - 2, verts.length - 1]);
  }

  const positions = [];
  for (const f of faces) {
    for (const vi of f) {
      const v = verts[vi];
      positions.push(v.x, v.y, v.z);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

  // simple UVs
  const triCount = positions.length / 3 / 3;
  const uvs = [];
  for (let i = 0; i < triCount; i++) {
    uvs.push(0.5, 1);
    uvs.push(0, 0);
    uvs.push(1, 0);
  }
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

  geo.clearGroups();
  for (let i = 0; i < triCount; i++) geo.addGroup(i * 3, 3, i);
  geo.computeVertexNormals();
  return geo;
}

// ========== Dice mesh ==========
function D10Mesh({ rolling, targetQuaternion, materials, rollDirection, resetSignal, initialQuaternion }) {
  const meshRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const hasBounced = useRef(false);

  const geometry = useMemo(() => makeD10Geometry(), []);

  useEffect(() => {
    pos.current.set(0, 0, 0);
    velocity.current.set(rollDirection[0] * 3, rollDirection[1] * 4, rollDirection[2] * 3);
    hasBounced.current = false;
    if (meshRef.current) {
      meshRef.current.position.set(0, 0, 0);
      meshRef.current.quaternion.copy(initialQuaternion);
    }
  }, [resetSignal, rollDirection, initialQuaternion]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    if (rolling) {
      velocity.current.y += GRAVITY * delta * 0.6;
      pos.current.addScaledVector(velocity.current, delta);
      mesh.position.copy(pos.current);
      if (pos.current.y < -1.4 && !hasBounced.current) {
        pos.current.y = -1.4;
        velocity.current.y *= -BOUNCE_DAMPING;
        hasBounced.current = true;
      }
      mesh.rotation.x += delta * (8 + Math.random() * 3);
      mesh.rotation.y += delta * (10 + Math.random() * 3);
      mesh.rotation.z += delta * (7 + Math.random() * 2);
      mesh.quaternion.setFromEuler(mesh.rotation);
    } else if (targetQuaternion) {
      mesh.quaternion.slerp(targetQuaternion, Math.min(1, delta * 6));
      mesh.position.lerp(new THREE.Vector3(0, 0, 0), delta * 3);
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={materials} />;
}

// ========== Main D10 component ==========
export default function D10() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(10);
  const [targetQuat, setTargetQuat] = useState(null);
  const [rollDirection, setRollDirection] = useState([0, 0, 0]);
  const [resetSignal, setResetSignal] = useState(0);
  const [initialQuat, setInitialQuat] = useState(new THREE.Quaternion());

  const materials = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) =>
        new THREE.MeshStandardMaterial({
          map: makeNumberTexture(i + 1, 256, "#4e342e", "#ffffff"),
          roughness: 0.5,
          metalness: 0.0,
          side: THREE.FrontSide,
        })
      ),
    []
  );

  // align face 10 toward camera (+Z)
  useEffect(() => {
    const g = makeD10Geometry();
    g.computeVertexNormals();
    const normals = g.attributes.normal;
    const faceIndex = 9;
    const i0 = faceIndex * 3;
    const n0 = new THREE.Vector3().fromBufferAttribute(normals, i0);
    const n1 = new THREE.Vector3().fromBufferAttribute(normals, i0 + 1);
    const n2 = new THREE.Vector3().fromBufferAttribute(normals, i0 + 2);
    const faceNormal = new THREE.Vector3().add(n0).add(n1).add(n2).divideScalar(3).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(faceNormal, new THREE.Vector3(0, 0, 1));
    setInitialQuat(q);
  }, []);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    const faceIndex = Math.floor(Math.random() * 10);
    const faceNumber = faceIndex + 1;
    setResult(faceNumber);
    const dir = new THREE.Vector3((Math.random() - 0.5) * 2, Math.random() * 1.5 + 1.2, (Math.random() - 0.5) * 2).normalize();
    setRollDirection([dir.x, dir.y, dir.z]);
    setResetSignal((s) => s + 1);

    const g = makeD10Geometry();
    g.computeVertexNormals();
    const normals = g.attributes.normal;
    const i0 = faceIndex * 3;
    const n0 = new THREE.Vector3().fromBufferAttribute(normals, i0);
    const n1 = new THREE.Vector3().fromBufferAttribute(normals, i0 + 1);
    const n2 = new THREE.Vector3().fromBufferAttribute(normals, i0 + 2);
    const faceNormal = new THREE.Vector3().add(n0).add(n1).add(n2).divideScalar(3).normalize();
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(faceNormal, new THREE.Vector3(0, 0, 1));

    setTimeout(() => {
      setTargetQuat(targetQuaternion);
      setRolling(false);
    }, ROLL_DURATION_MS);
  };

  return (
    <div style={{ width: 340 }}>
      <div style={{ width: 300, height: 300, margin: "0 auto" }} onClick={rollDice}>
        <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <mesh position={[0, -1.4, 0]} visible={false}>
            <boxGeometry args={[5, 0.1, 5]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>
          <D10Mesh
            rolling={rolling}
            targetQuaternion={targetQuat}
            materials={materials}
            rollDirection={rollDirection}
            resetSignal={resetSignal}
            initialQuaternion={initialQuat}
          />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>

      <div style={{ textAlign: "center", marginTop: 8 }}>
        <button
          onClick={rollDice}
          disabled={rolling}
          style={{
            padding: "6px 12px",
            cursor: rolling ? "not-allowed" : "pointer",
            borderRadius: 6,
          }}
        >
          Roll D10
        </button>
        <div style={{ marginTop: 8 }}>
          Result: <strong>{result}</strong>
        </div>
      </div>
    </div>
  );
}
