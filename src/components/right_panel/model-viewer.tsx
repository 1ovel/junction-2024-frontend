'use client'

import { useFileContext } from '@/context/FileContext';
import { useModelContext } from '@/context/ModelContext';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';

const ModelViewer: React.FC = () => {
    const { object3d, setObject3d, model, setModel, numberOfFloors, setNumberOfFloors, floorHeight, setFloorGroups, floorGroups } = useModelContext();
    const { finalSvgs, serverReturned } = useFileContext();
    const divRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const loaderRef = useRef<SVGLoader | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);


    const scaledFloorHeight = floorHeight;

    // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     const file = event.target.files?.[0];
    //     if (file) {
    //         setModel(file); // Update the model state with the selected file
    //         setNumberOfFloors(numberOfFloors + 1)
    //     }
    // };

    useEffect(() => {
        if (divRef.current && !sceneRef.current) {
            console.log('Initializing Three.js in production');
            const { width, height } = divRef.current.getBoundingClientRect();

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);
            const camera = new THREE.PerspectiveCamera(50, divRef.current.clientWidth / divRef.current.clientHeight, 0.1, 10000);camera.position.set(-249.21088839875534, -669.2944115862374, 1495.0210107106598);
            // Set camera rotation
            camera.rotation.set(
              1.034004350470264,
              -0.4502496519920817,
              -0.2534047815947666,
              'XYZ'
            );
            cameraRef.current = camera;
            // camera.position.x = 500;
            // camera.position.y = 500;
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            const loader = new SVGLoader();
            loaderRef.current = loader;
            renderer.setSize(width, height);
            divRef.current.replaceChild(renderer.domElement, divRef.current.querySelector('canvas')!);


            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 1, 1).normalize();
            scene.add(light);

            const controls = new OrbitControls(camera, renderer.domElement); // Initialize OrbitControls
            // controls.minAzimuthAngle = -Math.PI / 2; // Limit the rotation of the camera
            // controls.maxAzimuthAngle = -Math.PI / 2; // Limit the rotation of the camera
            cameraRef.current.up.set(0, 0, 1);

            // controls.minPolarAngle = -Math.PI / 2; // Limit the rotation of the camera
            // controls.maxPolarAngle = -Math.PI / 2; // Limit the rotation of the camera
            controlsRef.current = controls;


            sceneRef.current = scene;

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update(); // Update controls on each frame
                renderer.render(sceneRef.current, cameraRef.current);
            };
            animate();


            // return () => {
            //     renderer.dispose();
            //     divRef.current?.removeChild(renderer.domElement);
            // };
        }
    }, [cameraRef.current?.position]);

    useEffect(() => {
        if (!sceneRef.current) return;

        sceneRef.current.children.forEach((child) => {
            if (child instanceof THREE.Group) {
                sceneRef.current!.remove(child);
            }
        });

        floorGroups.forEach((group) => {
            sceneRef.current!.add(group);
        });
    }, [floorGroups]);

    useEffect(() => {
        if (!serverReturned) return;

        let groups: THREE.Group[] = [];

        finalSvgs.current.forEach((svg, idx) => {
            console.log(svg);
            const paths = loaderRef.current!.parse(svg).paths;

            console.log(paths); // Debugging: Check if paths are loaded

            const group = new THREE.Group();

            paths.forEach((path: any) => {
                const shapes = path.toShapes(true);


                shapes.forEach((shape: any) => {
                    const extrudeSettings = {
                        depth: 50,
                        bevelEnabled: true,
                        bevelSegments: 2,
                        steps: 2,
                        bevelSize: 1,
                        bevelThickness: 1
                    };

                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    const material = new THREE.MeshStandardMaterial({ color: 0x156289, emissive: 0x072534 });
                    material.transparent = true;
                    material.opacity = 0.7;
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(0, 0, (idx + 1) * 50);

                    group.add(mesh);
                });
            });

            groups.push(group);
            sceneRef.current!.add(...groups);
            const bb = new THREE.Box3().setFromObject(sceneRef.current!);
            let a = new THREE.Vector3();
            bb.getCenter(a)
            cameraRef.current?.lookAt(a);
            controlsRef.current?.update();
            console.log(cameraRef.current?.position);
            console.log(cameraRef.current?.rotation);

            // reader.readAsText(model); // Read the model file as text
            setObject3d(sceneRef.current!);
        });

        setFloorGroups(groups);
    }, [serverReturned]);

    useEffect(() => {
        console.log(scaledFloorHeight);
        console.log(sceneRef.current);
        
        if (sceneRef.current) {
            sceneRef.current!.scale.set(1, 1, scaledFloorHeight);
        }
    }, [scaledFloorHeight]);

    return (
        
        <div className='w-full flex-grow h-full' ref={divRef}>
            <canvas />
        </div>
    );
};

export default ModelViewer;
