
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const isHovered = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Background Stars/Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const count = 3000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) positions[i] = (Math.random() - 0.5) * 120;
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particlesMaterial = new THREE.PointsMaterial({ size: 0.08, color: 0x64748B, transparent: true, opacity: 0.3 });
    const backgroundParticles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(backgroundParticles);

    // Central Torus
    const torusGeometry = new THREE.TorusKnotGeometry(12, 1.5, 150, 20);
    const torusMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xF97316, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.1,
      emissive: 0xF97316,
      emissiveIntensity: 0.5
    });
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torusKnot);

    // Floating Musical Notes (Simulated with simple geometries)
    const noteGroup = new THREE.Group();
    const noteCount = 20;
    for (let i = 0; i < noteCount; i++) {
      const geometry = new THREE.SphereGeometry(0.4, 8, 8);
      const material = new THREE.MeshPhongMaterial({ color: 0xF97316, transparent: true, opacity: 0.5 });
      const mesh = new THREE.Mesh(geometry, material);
      
      const startPos = new THREE.Vector3(
        (Math.random() - 0.5) * 70,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 40
      );
      mesh.position.copy(startPos);
      
      mesh.userData = {
        basePos: startPos.clone(),
        speedX: Math.random() * 0.4 + 0.2,
        speedY: Math.random() * 0.5 + 0.3,
        speedZ: Math.random() * 0.3 + 0.1,
        ampX: Math.random() * 2 + 1,
        ampY: Math.random() * 3 + 2,
        ampZ: Math.random() * 1.5 + 0.5,
        rotSpeed: Math.random() * 0.02,
        offset: Math.random() * Math.PI * 2
      };
      noteGroup.add(mesh);
    }
    scene.add(noteGroup);

    // Mouse Trail Particles
    const trailCount = 60;
    const trailGeometry = new THREE.BufferGeometry();
    const trailPositions = new Float32Array(trailCount * 3);
    for(let i=0; i<trailCount; i++) {
      trailPositions[i*3] = 0; trailPositions[i*3+1] = 0; trailPositions[i*3+2] = 0;
    }
    trailGeometry.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMaterial = new THREE.PointsMaterial({ 
      size: 0.25, 
      color: 0xF97316, 
      transparent: true, 
      opacity: 0.7, 
      blending: THREE.AdditiveBlending 
    });
    const trailPoints = new THREE.Points(trailGeometry, trailMaterial);
    scene.add(trailPoints);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pLight = new THREE.PointLight(0xF97316, 150);
    pLight.position.set(20, 20, 20);
    scene.add(pLight);

    camera.position.z = 45;

    // Raycaster for hover detection
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouseVector.x = mouse.current.x;
      mouseVector.y = mouse.current.y;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let pulseFactor = 0;

    const animate = () => {
      requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Check for hover
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObject(torusKnot);
      const isCurrentlyHovered = intersects.length > 0;
      
      // Smoothly interpolate pulse factor
      const targetPulse = isCurrentlyHovered ? 1.0 : 0.0;
      pulseFactor += (targetPulse - pulseFactor) * 0.1;

      // Animate Torus
      torusKnot.rotation.y = elapsedTime * 0.15;
      torusKnot.rotation.x = elapsedTime * 0.08;
      
      // Base pulse + hover extra pulse
      const baseScale = 1 + Math.sin(elapsedTime * 1.5) * 0.05;
      const hoverScale = Math.sin(elapsedTime * 5.0) * 0.05 * pulseFactor;
      torusKnot.scale.setScalar(baseScale + hoverScale + (pulseFactor * 0.05));
      
      // Adjust emissivity on hover
      torusMaterial.emissiveIntensity = 0.5 + (pulseFactor * 0.5);

      backgroundParticles.rotation.y = elapsedTime * 0.01;

      // Animate floating notes (Bob and Weave)
      noteGroup.children.forEach((note: any) => {
        const { basePos, speedX, speedY, speedZ, ampX, ampY, ampZ, rotSpeed, offset } = note.userData;
        
        note.position.x = basePos.x + Math.sin(elapsedTime * speedX + offset) * ampX;
        note.position.y = basePos.y + Math.cos(elapsedTime * speedY + offset) * ampY;
        note.position.z = basePos.z + Math.sin(elapsedTime * speedZ + offset) * ampZ;
        
        note.rotation.x += rotSpeed;
        note.rotation.y += rotSpeed;
      });

      // Update trail
      const posArray = trailPoints.geometry.attributes.position.array as Float32Array;
      const targetX = mouse.current.x * 40;
      const targetY = mouse.current.y * 30;
      
      for(let i = trailCount - 1; i > 0; i--) {
        posArray[i*3] = posArray[(i-1)*3];
        posArray[i*3+1] = posArray[(i-1)*3+1];
        posArray[i*3+2] = posArray[(i-1)*3+2];
      }
      posArray[0] += (targetX - posArray[0]) * 0.35;
      posArray[1] += (targetY - posArray[1]) * 0.35;
      posArray[2] = 0;
      trailPoints.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10 bg-brand-dark" />;
};
