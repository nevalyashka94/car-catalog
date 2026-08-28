import { useEffect, useRef } from "react";
import * as THREE from "three";

interface Cat3DViewProps {
  isTyping?: boolean;
}

export default function Cat3DView({ isTyping = false }: Cat3DViewProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(isTyping);

  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 96;
    const height = container.clientHeight || 96;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 2.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 2.5);
    topLight.position.set(2, 4, 3);
    scene.add(topLight);

    const redGlow = new THREE.PointLight(0xef4444, 4.0, 6);
    redGlow.position.set(0, -0.5, 1.5);
    scene.add(redGlow);

    const blueRim = new THREE.PointLight(0x38bdf8, 2.5, 6);
    blueRim.position.set(-1.5, 1, -1);
    scene.add(blueRim);

    // Основная группа персонажа
    const catGroup = new THREE.Group();
    scene.add(catGroup);

    // Материалы
    const furMaterial = new THREE.MeshStandardMaterial({
      color: 0x64748b, // серый окрас
      roughness: 0.6,
      metalness: 0.1,
    });

    const darkFurMaterial = new THREE.MeshStandardMaterial({
      color: 0x334155, // полоски/акценты
      roughness: 0.7,
    });

    const innerEarMaterial = new THREE.MeshStandardMaterial({
      color: 0xfda4af, // розовые ушки внутри
      roughness: 0.5,
    });

    const scarfMaterial = new THREE.MeshStandardMaterial({
      color: 0xdc2626, // красный шарф
      roughness: 0.3,
      metalness: 0.2,
    });

    const eyeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // яркие янтарные глаза
      roughness: 0.1,
      metalness: 0.8,
    });

    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x090d16 });
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });

    // Голова
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 32), furMaterial);
    head.scale.set(1.05, 0.95, 1);
    head.position.set(0, 0.2, 0);
    catGroup.add(head);

    // Пухлые щечки
    const cheekLeft = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), furMaterial);
    cheekLeft.position.set(-0.24, 0.08, 0.35);
    catGroup.add(cheekLeft);

    const cheekRight = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), furMaterial);
    cheekRight.position.set(0.24, 0.08, 0.35);
    catGroup.add(cheekRight);

    // Ушки
    const earGeo = new THREE.ConeGeometry(0.18, 0.35, 16);
    const earLeft = new THREE.Mesh(earGeo, furMaterial);
    earLeft.position.set(-0.32, 0.62, 0.05);
    earLeft.rotation.set(0, 0, 0.35);
    catGroup.add(earLeft);

    const earInnerLeft = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 16), innerEarMaterial);
    earInnerLeft.position.set(-0.31, 0.61, 0.08);
    earInnerLeft.rotation.set(0, 0, 0.35);
    catGroup.add(earInnerLeft);

    const earRight = new THREE.Mesh(earGeo, furMaterial);
    earRight.position.set(0.32, 0.62, 0.05);
    earRight.rotation.set(0, 0, -0.35);
    catGroup.add(earRight);

    const earInnerRight = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.26, 16), innerEarMaterial);
    earInnerRight.position.set(0.31, 0.61, 0.08);
    earInnerRight.rotation.set(0, 0, -0.35);
    catGroup.add(earInnerRight);

    // Глаза
    const eyeGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const eyeLeft = new THREE.Mesh(eyeGeo, eyeMaterial);
    eyeLeft.position.set(-0.19, 0.22, 0.44);
    catGroup.add(eyeLeft);

    const pupilLeft = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), pupilMaterial);
    pupilLeft.position.set(-0.19, 0.22, 0.52);
    catGroup.add(pupilLeft);

    const eyeRight = new THREE.Mesh(eyeGeo, eyeMaterial);
    eyeRight.position.set(0.19, 0.22, 0.44);
    catGroup.add(eyeRight);

    const pupilRight = new THREE.Mesh(new THREE.SphereGeometry(0.05, 16, 16), pupilMaterial);
    pupilRight.position.set(0.19, 0.22, 0.52);
    catGroup.add(pupilRight);

    // Носик
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.05, 3), noseMaterial);
    nose.position.set(0, 0.14, 0.53);
    nose.rotation.set(Math.PI, 0, 0);
    catGroup.add(nose);

    // Красный кибер-шарфик
    const scarf = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.12, 16, 32), scarfMaterial);
    scarf.rotation.x = Math.PI / 2 + 0.15;
    scarf.position.set(0, -0.15, 0.05);
    catGroup.add(scarf);

    // Пухлое тело
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), furMaterial);
    body.position.set(0, -0.5, -0.05);
    body.scale.set(1.05, 0.9, 0.95);
    catGroup.add(body);

    catGroup.position.y = -0.05;

    // Слежение за курсором мыши
    const targetRotation = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.y = x * 0.45;
      targetRotation.x = -y * 0.25;
    };
    window.addEventListener("mousemove", onMouseMove);

    let reqId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // Дыхание и покачивание
      const typingSpeed = isTypingRef.current ? 3.5 : 1.2;
      catGroup.position.y = -0.05 + Math.sin(time * typingSpeed) * 0.03;

      // Плавный поворот за курсором
      catGroup.rotation.y += (targetRotation.y - catGroup.rotation.y) * 0.08;
      catGroup.rotation.x += (targetRotation.x - catGroup.rotation.x) * 0.08;

      if (isTypingRef.current) {
        catGroup.rotation.z = Math.sin(time * 10) * 0.05;
      } else {
        catGroup.rotation.z *= 0.95;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(reqId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full pointer-events-none" />;
}
