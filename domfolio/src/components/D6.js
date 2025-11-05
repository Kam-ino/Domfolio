import React, { useRef, useState, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";

const ROLL_DURATION_MS = 1800;
const GRAVITY = -9.8;
const BOUNCE_DAMPING = 0.5;

function makeNumberTexture(number, size = 256, bgcolor = "#1565c0", fg = "#fff") {
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

  if (number === 6) {
    const underlineWidth = size * 0.3;
    const underlineHeight = size * 0.02;
    const underlineY = size / 2 + size * 0.25; // below the number
    ctx.fillRect(size / 2 - underlineWidth / 2, underlineY, underlineWidth, underlineHeight);
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

// ===== D6 mesh component =====
function D6Mesh({ rolling, targetQuaternion, materials, rollDirection, rollStartTime, resetSignal, initialQuaternion }) {
  const meshRef = useRef();
  const velocity = useRef(new THREE.Vector3());
  const pos = useRef(new THREE.Vector3(0, 0, 0));
  const hasBounced = useRef(false);

  // reset when new roll starts
  useEffect(() => {
    pos.current.set(0, 0, 0);
    velocity.current.set(
      rollDirection[0] * 3,
      rollDirection[1] * 4,
      rollDirection[2] * 3
    );
    hasBounced.current = false;
    if (meshRef.current) {
      meshRef.current.position.set(0, 0, 0);
      meshRef.current.quaternion.copy(initialQuaternion); // face 6 faces the user initially
    }
  }, [resetSignal, rollDirection, initialQuaternion]);

  // motion update
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

  return (
    <mesh ref={meshRef} geometry={new THREE.BoxGeometry(1, 1, 1)} material={materials} />
  );
}

// ===== Main D6 component =====
export default function D6() {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState(6);
  const [targetQuat, setTargetQuat] = useState(null);
  const [rollDirection, setRollDirection] = useState([0, 0, 0]);
  const [rollStartTime, setRollStartTime] = useState(0);
  const [resetSignal, setResetSignal] = useState(0);
  const [initialQuat, setInitialQuat] = useState(new THREE.Quaternion());

  // materials for six faces
  const materials = useMemo(() => {
    return [1, 2, 3, 4, 5, 6].map((n) => {
      return new THREE.MeshStandardMaterial({
        map: makeNumberTexture(n, 256, "#1565c0", "#ffffff"),
        roughness: 0.5,
        metalness: 0.0,
        side: THREE.FrontSide,
      });
    });
  }, []);

  // compute target quaternion for the given rolled face
  const getFaceQuaternion = (faceNumber) => {
    const orientations = {
      1: new THREE.Euler(0, 0, 0),                // front
      2: new THREE.Euler(Math.PI, 0, 0),          // back
      3: new THREE.Euler(-Math.PI / 2, 0, 0),     // top
      4: new THREE.Euler(Math.PI / 2, 0, 0),      // bottom
      5: new THREE.Euler(0, Math.PI / 2, 0),      // right
      6: new THREE.Euler(0, -Math.PI / 2, 0),     // left
    };
    const e = orientations[faceNumber] || orientations[1];
    const q = new THREE.Quaternion().setFromEuler(e);
    return q;
  };

  // make face 6 face the camera initially
  useEffect(() => {
    setInitialQuat(getFaceQuaternion(6));
  }, []);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    setRollStartTime(performance.now() / 1000);

    // pick random face result 1–6
    const faceNumber = Math.floor(Math.random() * 6) + 1;
    setResult(faceNumber);

    // random direction
    const dir = new THREE.Vector3(
      (Math.random() - 0.5) * 2,
      Math.random() * 1.5 + 1.2,
      (Math.random() - 0.5) * 2
    ).normalize();
    setRollDirection([dir.x, dir.y, dir.z]);
    setResetSignal((s) => s + 1);

    // compute final quaternion for chosen face
    const targetQuaternion = getFaceQuaternion(faceNumber);

    // stop rolling
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

          {/* Dice */}
          <D6Mesh
            rolling={rolling}
            targetQuaternion={targetQuat}
            materials={materials}
            rollDirection={rollDirection}
            rollStartTime={rollStartTime}
            resetSignal={resetSignal}
            initialQuaternion={initialQuat}
          />

          {/* Disable user camera drag */}
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>
    </div>
  );
}
    