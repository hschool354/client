import { useRef, useState, useEffect } from 'react'; 
import { useFrame } from '@react-three/fiber';
import { Environment, Shadow, CameraControls } from '@react-three/drei';
import { Spo } from '../3D/Spo'; 

const Ea = () => {
    const objectRef = useRef();
    const cameraControlsRef = useRef();
    const [autoRotate, setAutoRotate] = useState(true);
  
    const toggleAutoRotate = () => {
      setAutoRotate(!autoRotate);
    };
  
    useEffect(() => {
      if (cameraControlsRef.current) {
        // Đặt vị trí camera ban đầu để nhìn vào mô hình
        cameraControlsRef.current.setLookAt(0, 2, 12, 0, 0, 0, true);
      }
    }, []);
  
    // Sử dụng useFrame để quay mô hình quanh trục y
    useFrame(({ clock }) => {
      if (autoRotate && objectRef.current) {
        objectRef.current.rotation.y = clock.getElapsedTime() * 0.3; // Quay quanh trục y với tốc độ 0.3 rad/s
      }
    });
  
    return (
      <>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={1.8} castShadow />
        
        {/* Nhóm chứa mô hình để chỉ quay mô hình */}
        <group ref={objectRef} onClick={toggleAutoRotate}>
          <Spo 
            position={[0, 0, 0]}
            scale={[0.5, 0.5, 0.5]}
            rotation={[0, 0, 0]}
          />
          <Shadow position={[0, -0.5, 0]} scale={[6, 6, 6]} opacity={0.3} />
        </group>
        
        {/* CameraControls để điều khiển camera thủ công nếu cần */}
        <CameraControls 
          ref={cameraControlsRef} 
          dampingFactor={0.1} 
          dragToLook={false} // Không cho phép kéo để nhìn, giữ camera cố định
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={0}
          minDistance={5}
          maxDistance={20}
        />
        
        <Environment preset="studio" background={false} />
      </>
    );
};

export default Ea;