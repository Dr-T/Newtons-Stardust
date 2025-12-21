import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ParticleSettings } from '../types';

// --- UTILITIES ---

/**
 * Solves Kepler's Equation M = E - e*sin(E) for E using Newton-Raphson iteration.
 * @param M Mean Anomaly (radians)
 * @param e Eccentricity
 * @returns Eccentric Anomaly E (radians)
 */
function solveKepler(M: number, e: number): number {
  let E = M;
  const tolerance = 1e-6;
  
  // Newton-Raphson iteration
  for (let i = 0; i < 10; i++) {
    const f = E - e * Math.sin(E) - M;
    const df = 1 - e * Math.cos(E);
    const delta = f / df;
    E -= delta;
    if (Math.abs(delta) < tolerance) break;
  }
  
  return E;
}

// --- COMPONENTS ---

interface PlanetProps {
  a: number; // Semi-major axis
  e: number; // Eccentricity
  color: string;
  size: number;
  speed: number;
  rotationOffset: number; // Argument of periapsis + Longitude of ascending node combined for 2D visual
  audioLevel: number;
  thickness: number;
}

const Planet: React.FC<PlanetProps> = ({ a, e, color, size, speed, rotationOffset, audioLevel, thickness }) => {
  const planetRef = useRef<THREE.Mesh>(null);
  
  // 1. Generate Orbit Path
  // The orbit path is static relative to the orbit's coordinate system.
  // We generate points for the full ellipse.
  const orbitPoints = useMemo(() => {
    const points = [];
    const segments = 128;
    const b = a * Math.sqrt(1 - e * e); // Semi-minor axis

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * 2 * Math.PI;
      // Parametric equation for ellipse with focus at origin (0,0):
      // x = a(cos(E) - e)
      // y = b*sin(E)
      // Note: We iterate E from 0 to 2PI to draw the shape.
      
      const x = a * (Math.cos(theta) - e);
      const y = b * Math.sin(theta);
      points.push(new THREE.Vector3(x, y, 0));
    }
    return points;
  }, [a, e]);

  const orbitCurve = useMemo(() => new THREE.CatmullRomCurve3(orbitPoints, true), [orbitPoints]);

  // 2. Animate Planet Position
  useFrame((state) => {
    if (!planetRef.current) return;

    // Calculate Mean Anomaly
    const time = state.clock.getElapsedTime();
    const M = (time * speed) % (2 * Math.PI); // Wrap around 2PI

    // Solve for Eccentric Anomaly
    const E = solveKepler(M, e);

    // Calculate Position (Orbit plane coordinates)
    // Focus is at (0,0,0)
    const b = a * Math.sqrt(1 - e * e);
    const x = a * (Math.cos(E) - e);
    const y = b * Math.sin(E);

    planetRef.current.position.set(x, y, 0);

    // Audio reactivity for scale
    const pulse = 1 + audioLevel * 0.5;
    planetRef.current.scale.setScalar(size * pulse);
  });

  return (
    <group rotation={[0, 0, rotationOffset]}>
      {/* Orbit Line - Using Tube for visibility and thickness control */}
      <mesh>
        <tubeGeometry args={[orbitCurve, 128, thickness, 8, true]} />
        <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={0.15 + audioLevel * 0.1} 
            side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Planet Body */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.5}
            roughness={0.2} 
            metalness={0.8}
        />
      </mesh>
    </group>
  );
};

// --- SOLAR SYSTEM DATA ---
// Data adjusted for visual clarity while maintaining relative characteristics
const PLANET_DATA = [
  // Mercury: High eccentricity (0.205), fast
  { name: 'Mercury', a: 12, e: 0.25, color: '#A5A5A5', size: 0.5, speed: 2.0, rot: 0.5 },
  // Venus: Low eccentricity, slow retrograde (ignored here), bright
  { name: 'Venus',   a: 17, e: 0.05, color: '#E3BB76', size: 0.9, speed: 1.2, rot: 2.0 },
  // Earth: Standard
  { name: 'Earth',   a: 24, e: 0.08, color: '#22A6B3', size: 1.0, speed: 0.8, rot: 3.5 },
  // Mars: Red, smaller, somewhat eccentric
  { name: 'Mars',    a: 32, e: 0.15, color: '#EB4D4B', size: 0.7, speed: 0.6, rot: 5.0 },
  // Jupiter: Huge, slow
  { name: 'Jupiter', a: 55, e: 0.06, color: '#F9CA24', size: 2.5, speed: 0.3, rot: 1.0 },
  // Saturn: Rings (simplified as sphere here), slow
  { name: 'Saturn',  a: 75, e: 0.07, color: '#F0932B', size: 2.2, speed: 0.2, rot: 4.2 },
  // Uranus: Ice giant
  { name: 'Uranus',  a: 95, e: 0.05, color: '#7ED6DF', size: 1.8, speed: 0.15, rot: 2.5 },
  // Neptune: Deep blue, circular
  { name: 'Neptune', a: 115, e: 0.02, color: '#30336B', size: 1.7, speed: 0.1, rot: 6.0 },
];

const SolarSystem: React.FC<{ settings: ParticleSettings, audioLevel: number }> = ({ settings, audioLevel }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
      if (groupRef.current) {
          // Slow rotation of the entire system for cinematic effect
          groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
      }
  });

  return (
    <group ref={groupRef} rotation={[Math.PI / 3, 0, 0]}> 
      {/* THE SUN - At the Origin (0,0,0) */}
      <mesh position={[0,0,0]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#FFD700" />
      </mesh>
      <pointLight position={[0,0,0]} intensity={3} color="#FFD700" distance={300} decay={1.5} />
      
      {/* Sun Glow */}
      <mesh position={[0,0,0]} scale={[1.5, 1.5, 1.5]}>
         <sphereGeometry args={[4, 32, 32]} />
         <meshBasicMaterial color="#FFA500" transparent opacity={0.2} />
      </mesh>

      {/* Planets */}
      {PLANET_DATA.map((p, i) => (
        <Planet
            key={i}
            a={p.a * settings.dispersion} // Apply expansion setting
            e={p.e}
            color={p.color}
            size={p.size * settings.particleSize * 0.3}
            speed={p.speed * settings.flowSpeed * 0.5}
            rotationOffset={p.rot}
            audioLevel={audioLevel}
            thickness={settings.orbitThickness}
        />
      ))}
    </group>
  );
};

// --- STARDUST SHADER ---
const StardustShader = {
    uniforms: {
      uTime: { value: 0 },
      uAudioLevel: { value: 0 },
      uDispersion: { value: 1.0 },
      uPointSize: { value: 2.0 },
      uFlowSpeed: { value: 0.2 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uAudioLevel;
      uniform float uDispersion;
      uniform float uPointSize;
      uniform float uFlowSpeed;
      varying vec3 vColor;
      varying float vAlpha;
  
      // Simplex noise (simplified)
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
      vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
      float snoise(vec3 v) { 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
        i = mod289(i); 
        vec4 p = permute( permute( permute( 
                  i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                      dot(p2,x2), dot(p3,x3) ) );
      }
  
      void main() {
        vec3 pos = position;
        
        // Spread
        pos *= 2.0 * uDispersion;
        
        // Flow
        float noise = snoise(pos * 0.1 + vec3(0, 0, uTime * uFlowSpeed * 0.2));
        
        // Audio reaction
        float pulse = smoothstep(0.1, 0.8, uAudioLevel);
        pos.z += pulse * 20.0 * noise;
  
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
  
        // Size attenuation
        gl_PointSize = uPointSize * (1.0 + pulse * 2.0) * (300.0 / -mvPosition.z);
        
        vColor = vec3(0.8, 0.9, 1.0);
        vAlpha = 0.5 + 0.5 * noise;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center);
        if (dist > 0.5) discard;
        float glow = 1.0 - (dist * 2.0);
        glow = pow(glow, 2.0);
        gl_FragColor = vec4(vColor, vAlpha * glow);
      }
    `
};

const BackgroundStardust: React.FC<{ settings: ParticleSettings, audioLevel: number }> = ({ settings, audioLevel }) => {
    const ref = useRef<THREE.ShaderMaterial>(null);
    const geometry = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for(let i=0; i<count*3; i++) {
            positions[i] = (Math.random() - 0.5) * 200; // Large spread
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, []);

    useFrame((state) => {
        if (ref.current) {
            ref.current.uniforms.uTime.value = state.clock.elapsedTime;
            ref.current.uniforms.uAudioLevel.value = audioLevel;
            ref.current.uniforms.uDispersion.value = settings.dispersion;
            ref.current.uniforms.uPointSize.value = settings.particleSize;
            ref.current.uniforms.uFlowSpeed.value = settings.flowSpeed;
        }
    });

    return (
        <points geometry={geometry}>
            <shaderMaterial ref={ref} args={[StardustShader]} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
        </points>
    );
};

// --- MAIN COMPONENT ---

export const ParticleView: React.FC<{ imageUrl: string, audioLevel: number, settings: ParticleSettings }> = (props) => {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-black">
      <Canvas camera={{ position: [0, 80, 120], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.2} />
        <SolarSystem settings={props.settings} audioLevel={props.audioLevel} />
        <BackgroundStardust settings={props.settings} audioLevel={props.audioLevel} />
      </Canvas>
    </div>
  );
};