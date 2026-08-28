import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

interface Cat3DViewProps {
  isTyping?: boolean;
}

export default function Cat3DView({ isTyping = false }: Cat3DViewProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(isTyping);

  // Синхронизируем стейт печати с циклом анимации
  useEffect(() => {
    isTypingRef.current = isTyping;
  }, [isTyping]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 96;
    const height = container.clientHeight || 96;

    const scene = new THREE.Scene();
    
    // Камера ближе к коту
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 1.7);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Освещение для объемной шерсти
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);

    const frontLight = new THREE.DirectionalLight(0xffffff, 3.5);
    frontLight.position.set(0, 3, 4);
    scene.add(frontLight);

    const redRimLight = new THREE.PointLight(0xef4444, 5.0, 10);
    redRimLight.position.set(-2, 0, 1);
    scene.add(redRimLight);

    const cyanRimLight = new THREE.PointLight(0x38bdf8, 3.5, 10);
    cyanRimLight.position.set(2, -1, 1);
    scene.add(cyanRimLight);

    let mixer: THREE.AnimationMixer | null = null;
    let model: THREE.Group | null = null;
    const clock = new THREE.Clock();

    // Отслеживание курсора мыши
    const targetRotation = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.y = x * 0.45;
      targetRotation.x = -y * 0.25;
    };
    window.addEventListener("mousemove", onMouseMove);

    const loader = new GLTFLoader();
    const modelUrl = `${import.meta.env.BASE_URL}images/cat.glb`;

    loader.load(
      modelUrl,
      (gltf: GLTF) => {
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Увеличенный масштаб мордочки кота
        const scale = 2.1 / (maxDim || 1);
        model.scale.setScalar(scale);

        // Центрирование и смещение вниз, чтобы акцент был на мордочке
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale - 0.22;
        model.position.z = -center.z * scale;

        // Поворот кота лицом прямо в камеру (под углом ~115 градусов)
        model.rotation.y = Math.PI * 0.65;

        scene.add(model);

        // Запуск встроенных анимаций клипа
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          gltf.animations.forEach((clip: THREE.AnimationClip) => {
            const action = mixer?.clipAction(clip);
            if (action) {
              action.timeScale = 0.8; // естественная скорость
              action.play();
            }
          });
        }
      },
      undefined,
      (err: unknown) => console.warn("Ошибка загрузки 3D кота:", err)
    );

    let reqId: number;
    const baseRotationY = Math.PI * 0.65;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (mixer) {
        // Ускоряем анимацию, когда кот отвечает
        mixer.update(delta * (isTypingRef.current ? 1.6 : 1.0));
      }

      if (model) {
        // Плавное слежение за курсором
        const desiredRotY = baseRotationY + targetRotation.y;
        const desiredRotX = targetRotation.x;
        
        model.rotation.y += (desiredRotY - model.rotation.y) * 0.06;
        model.rotation.x += (desiredRotX - model.rotation.x) * 0.06;

        // Дополнительное покачивание при генерации ответа
        if (isTypingRef.current) {
          model.position.y += Math.sin(elapsedTime * 12) * 0.0012;
          model.rotation.z = Math.sin(elapsedTime * 8) * 0.04;
        } else {
          model.rotation.z *= 0.95;
        }
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
