'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ModelViewer: React.FC = () => {
    const divRef = useRef<HTMLDivElement>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);

    useEffect(() => {
        if (divRef.current) {
            const { width, height } = divRef.current.getBoundingClientRect();
            
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer();
            renderer.setSize(width, height);
            divRef.current.appendChild(renderer.domElement);

            camera.position.z = 5;

            const animate = () => {
                requestAnimationFrame(animate);
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

    return (
        <div className='w-full flex-grow h-full' ref={divRef}>
        </div>
    );
};

export default ModelViewer;
