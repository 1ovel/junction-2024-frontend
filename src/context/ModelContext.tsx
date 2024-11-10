'use client'

import React, { createContext, useContext, useState } from 'react';
import * as THREE from 'three';

interface ModelContextType {
  setModel: React.Dispatch<React.SetStateAction<File | null>>;
  model: File | null;
  setNumberOfFloors: React.Dispatch<React.SetStateAction<number>>;
  numberOfFloors: number;
  setFloorHeight: React.Dispatch<React.SetStateAction<number>>;
  floorHeight: number;
  setFloorGroups: React.Dispatch<React.SetStateAction<THREE.Group[]>>;
  floorGroups: THREE.Group[];
  setObject3d: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
  object3d: THREE.Object3D | null;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export const ModelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [model, setModel] = useState<File | null>(null);
  const [numberOfFloors, setNumberOfFloors] = useState<number>(0)
  const [floorHeight, setFloorHeight] = useState<number>(10)
  const [floorGroups, setFloorGroups] = useState<THREE.Group[]>([]);
  const [object3d, setObject3d] = useState<THREE.Object3D | null>(null);

  return (
    <ModelContext.Provider value={{ object3d, setObject3d, model, setModel, numberOfFloors, setNumberOfFloors, floorHeight, setFloorHeight, floorGroups, setFloorGroups }}>
      {children}
    </ModelContext.Provider>
  );
};

export const useModelContext = () => {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModelContext must be used within a ModelProvider');
  }
  return context;
};
