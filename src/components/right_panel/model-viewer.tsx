'use client'

import { useModelContext } from '@/context/ModelContext';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const ModelViewer: React.FC = () => {
    const { model, setModel } = useModelContext();
    const divRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const loaderRef = useRef<SVGLoader | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setModel(file); // Update the model state with the selected file
        }
    };

    useEffect(() => {
        if (divRef.current && !sceneRef.current) {
            const { width, height } = divRef.current.getBoundingClientRect();

            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0xffffff);
            const camera = new THREE.PerspectiveCamera(50, divRef.current.clientWidth / divRef.current.clientHeight, 0.1, 10000);
            camera.position.z = 150;
            // camera.position.x = 500;
            // camera.position.y = 500;
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            const loader = new SVGLoader();
            loaderRef.current = loader;
            renderer.setSize(width, height);
            divRef.current.appendChild(renderer.domElement);


            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 1, 1).normalize();
            scene.add(light);

            const controls = new OrbitControls(camera, renderer.domElement); // Initialize OrbitControls

            const animate = () => {
                requestAnimationFrame(animate);
                controls.update(); // Update controls on each frame
                renderer.render(scene, camera);
            };
            animate();

            sceneRef.current = scene;

            return () => {
                renderer.dispose();
                divRef.current?.removeChild(renderer.domElement);
            };
        }
    }, []);

    useEffect(() => {
        if (!model) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const svgText = event.target?.result as string;
            const paths = loaderRef.current!.parse(svgText).paths;

            console.log(paths); // Debugging: Check if paths are loaded

            // Clear previous meshes before adding new ones
            while (sceneRef.current!.children.length > 0) {
                sceneRef.current!.remove(sceneRef.current!.children[0]);
            }

            // Loop through each path in the SVG and extrude
            paths.forEach((path: any) => {
                const shapes = path.toShapes(true);

                shapes.forEach((shape: any) => {
                    const extrudeSettings = {
                        depth: 100,
                        bevelEnabled: true,
                        bevelSegments: 2,
                        steps: 2,
                        bevelSize: 1,
                        bevelThickness: 1
                    };

                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
                    const material = new THREE.MeshStandardMaterial({ color: 0x156289, emissive: 0x072534 });
                    const mesh = new THREE.Mesh(geometry, material);
                    mesh.position.set(0, 0, 100); // Adjust position if necessary

                    sceneRef.current!.add(mesh);
                });
            });
        };

        reader.readAsText(model); // Read the model file as text
    }, [model]);

    return (
        <>
            <input type="file" accept=".svg" onChange={handleFileChange} />
            <div className='w-full flex-grow h-full' ref={divRef} />
        </>

    );
};

export default ModelViewer;
