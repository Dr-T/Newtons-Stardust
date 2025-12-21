import React from 'react';

export enum AppMode {
  UPLOAD = 'UPLOAD',
  CHAT = 'CHAT',
  SAVING = 'SAVING',
  GALLERY = 'GALLERY',
}

export interface ParticleSettings {
  dispersion: number;
  particleSize: number;
  contrast: number;
  flowSpeed: number;
  flowAmplitude: number;
  depthStrength: number;
  mouseRadius: number;
  colorShiftSpeed: number;
  orbitThickness: number; // New: Control orbit line thickness
  musicVolume: number;    // New: Control background music volume
}

export interface Assessment {
  formulaUnderstanding: number;
  logicRigor: number;
  application: number;
  advice: string;
}

export interface Memory {
  id: string;
  chapter: string; // Added chapter field
  date: string;
  title: string;
  content: string;
  duration: string;
  assessment?: Assessment;
  status?: 'mastered' | 'review_needed'; // New: Mastery status
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface AIPersona {
  id: string;
  name: string;
  roleDescription: string;
  icon: React.ComponentType<any>;
  systemInstruction: string;
  color: string;
}