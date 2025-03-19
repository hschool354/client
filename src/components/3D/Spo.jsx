import React, { useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function Spo(props) {
    const { nodes, materials } = useGLTF('/zbrush_4r4_how_to_draw_mech_using_insert_mesh.3.glb')
    const groupRef = useRef()
    
    // Căn chỉnh mô hình về trung tâm khi load xong
    useEffect(() => {
      if (groupRef.current) {
        // Tạo bounding box để tính toán kích thước thực tế của mô hình
        const box = new THREE.Box3().setFromObject(groupRef.current)
        const center = box.getCenter(new THREE.Vector3())
        
        // Di chuyển mô hình để căn giữa theo trục x và z, và đặt đáy mô hình tại y=0
        groupRef.current.position.x = -center.x
        groupRef.current.position.z = -center.z
        
        // Lấy chiều cao của bounding box
        const size = box.getSize(new THREE.Vector3())
        groupRef.current.position.y = -box.min.y // Đặt đáy mô hình tại y=0
        
        console.log('Model size:', size)
        console.log('Model center:', center)
      }
    }, [nodes])
  return (
    <group {...props} dispose={null}>
      <group ref={groupRef} rotation={[-Math.PI / 2, 0, 0]}>
        <group>
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_3.geometry}
            material={materials['02___Default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_4.geometry}
            material={materials['03___Default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_5.geometry}
            material={materials['04___Default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_6.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_7.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_8.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_9.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_10.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_11.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_12.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_13.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_14.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_15.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_16.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_17.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_18.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_19.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_20.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_21.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_22.geometry}
            material={materials['default']}
          />
          <mesh
            castShadow
            receiveShadow
            geometry={nodes.Object_23.geometry}
            material={materials['default']}
          />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/zbrush_4r4_how_to_draw_mech_using_insert_mesh.3.glb')