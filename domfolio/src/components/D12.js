import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

/**
 * D12 component
 * - Starts with side 12 facing the camera
 * - Prevents user camera drag
 * - Rolls randomly, bounces once, then settles with the rolled face flush to camera
 * - Geometry uses per-face UVs and material groups (non-indexed)
 */

const ROLL_DURATION_MS = 1800;
const GRAVITY = -9.8;
const BOUNCE_DAMPING = 0.5;

// ===== helper: create numbered textures for faces =====
function makeNumberTexture(number, size = 256, bgcolor = "#6a1b9a", fg = "#fff") {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = bgcolor;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = fg;
  ctx.font = `${Math.floor(size * 0.5)}px sans-serif`;
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

// ===== D12 mesh =====
function D12Mesh({ rolling, targetQuaternion, materials, rollDirection, rollStartTime, resetSignal, initialQuaternion }) {
  const meshRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const hasBounced = useRef(false);

  // --- Geometry setup (non-indexed, grouped per triangle, with UVs)
  const geometry = useMemo(() => {
    const g = new THREE.DodecahedronGeometry(1);
    const nonIndexed = g.toNonIndexed();

    const posAttr = nonIndexed.attributes.position;
    const triCount = posAttr.count / 3;
    const uvs = [];

    for (let i = 0; i < triCount; i++) {
      uvs.push(0.5, 1.0);
      uvs.push(0.0, 0.0);
      uvs.push(1.0, 0.0);
    }

    nonIndexed.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));

    nonIndexed.clearGroups();
    for (let i = 0; i < triCount; i++) {
      nonIndexed.addGroup(i * 3, 3, i);
    }

    nonIndexed.computeVertexNormals();
    return nonIndexed;
  }, []);

  // reset to start each roll
  useEffect(() => {
    pos.current.set(0, 0, 0);
    velocity.current.set(rollDirection[0] * 3, rollDirection[1] * 4, rollDirection[2] * 3);
    hasBounced.current = false;
    if (meshRef.current) {
      meshRef.current.position.set(0, 0, 0);
      meshRef.current.quaternion.copy(initialQuaternion); // face 12 faces camera initially
    }
  }, [resetSignal, rollDirection, initialQuaternion]);

  // animate dice
  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (rolling) {
      velocity.current.y += GRAVITY * delta * 0.6;
      pos.current.addScaledVector(velocity.current, delta);
      mesh.position.copy(pos.current);

      // bounce once
      if (pos.current.y < -1.4 && !hasBounced.current) {
        pos.current.y = -1.4;
        velocity.current.y *= -BOUNCE_DAMPING;
        hasBounced.current = true;
      }

      // spin
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

// ===== Main D12 component =====
export default function D12() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(12);
  const [targetQuat, setTargetQuat] = useState(null);
  const [rollDirection, setRollDirection] = useState([0, 0, 0]);
  const [rollStartTime, setRollStartTime] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [initialQuat, setInitialQuat] = useState(new THREE.Quaternion());

  // create materials for 12 faces
  const materials = useMemo(() => {
    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
          return new THREE.MeshStandardMaterial({
            map: makeNumberTexture(n, 256, "#6a1b9a", "#ffffff"),
            roughness: 0.5,
            metalness: 0.0,
            side: THREE.FrontSide,
          });
        });
  }, []);

  // Compute quaternion for face 12 facing the camera (+Z)
  useEffect(() => {
    const geo = new THREE.DodecahedronGeometry(1).toNonIndexed();
    geo.computeVertexNormals();
    const normals = geo.attributes.normal;
    const faceIndex = 11; // side 12 (last face)
    const i0 = faceIndex * 3;
    const n0 = new THREE.Vector3().fromBufferAttribute(normals, i0);
    const n1 = new THREE.Vector3().fromBufferAttribute(normals, i0 + 1);
    const n2 = new THREE.Vector3().fromBufferAttribute(normals, i0 + 2);
    const faceNormal = new THREE.Vector3().add(n0).add(n1).add(n2).divideScalar(3).normalize();

    const forward = new THREE.Vector3(0, 0, 1);
    const q = new THREE.Quaternion().setFromUnitVectors(faceNormal, forward);
    setInitialQuat(q);
  }, []);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    setRollStartTime(performance.now() / 1000);

    const faceIndex = Math.floor(Math.random() * 12);
    const faceNumber = faceIndex + 1;
    setResult(faceNumber);

    const dir = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 1.5 + 1.2,
      (Math.random() - 0.5) * 2
    ).normalize();
    setRollDirection([dir.x, dir.y, dir.z]);
    setResetSignal((s) => s + 1);

    // compute the correct final quaternion for the rolled face
    const tempGeo = new THREE.DodecahedronGeometry(1).toNonIndexed();
    tempGeo.computeVertexNormals();
    const normals = tempGeo.attributes.normal;
    const i0 = faceIndex * 3;
    const n0 = new THREE.Vector3().fromBufferAttribute(normals, i0);
    const n1 = new THREE.Vector3().fromBufferAttribute(normals, i0 + 1);
    const n2 = new THREE.Vector3().fromBufferAttribute(normals, i0 + 2);
    const faceNormal = new THREE.Vector3().add(n0).add(n1).add(n2).divideScalar(3).normalize();

    const up = new THREE.Vector3(0, 0, 1); // camera forward
    const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(faceNormal, up);

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

          {/* Invisible floor */}
          <mesh position={[0, -1.4, 0]} visible={false}>
            <boxGeometry args={[5, 0.1, 5]} />
            <meshBasicMaterial transparent opacity={0} />
          </mesh>

          <D12Mesh
            rolling={rolling}
            targetQuaternion={targetQuat}
            materials={materials}
            rollDirection={rollDirection}
            rollStartTime={rollStartTime}
            resetSignal={resetSignal}
            initialQuaternion={initialQuat}
          />

          {/* Disable camera drag */}
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
          Roll D12
        </button>
        <div style={{ marginTop: 8 }}>
          Result: <strong>{result}</strong>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: "#666" }}>
          Side 12 faces the camera by default. Click to roll — it bounces once and settles with the rolled face visible.
        </div>
      </div>
    </div>
  );
}
