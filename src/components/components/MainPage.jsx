import React, { Suspense } from 'react';
import Ea from '../components/Ea'; // Đảm bảo tên file và đường dẫn khớp
import { Canvas } from '@react-three/fiber';

export const MainPage = () => {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 5], fov: 50, near: 0.1, far: 1000 }}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <group position={[0, 0, 0]}>
          <Ea />
        </group>
      </Suspense>
      {/* Ánh sáng chung cho cảnh */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
    </Canvas>
  );
};

export default MainPage;