   declare module 'three/examples/jsm/controls/OrbitControls' {
    import { Camera, EventDispatcher } from 'three';

    export interface OrbitControls extends EventDispatcher {
        object: Camera;
        domElement: HTMLElement;

        // Add any other methods or properties you need
        getPolarAngle(): number;
        getAzimuthalAngle(): number;
        saveState(): void;
        reset(): void;
        update(): void;
        dispose(): void;
        // ...
    }

    export class OrbitControls {
        constructor(object: Camera, domElement: HTMLElement);
        // ...
    }
}