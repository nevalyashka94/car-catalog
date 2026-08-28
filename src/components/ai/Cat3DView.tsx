import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader, GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

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
    
    // Камера для портретного вида
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.1, 1.8);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

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

    // Точный угол разворота лицом к камере (-90 градусов от изначального бокового положения)
    const baseRotationY = -Math.PI / 2;

    loader.load(
      modelUrl,
      (gltf: GLTF) => {
        model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        // Уменьшили масштаб, чтобы голова не вылезала за края
        const scale = 1.75 / (maxDim || 1);
        model.scale.setScalar(scale);

        // Смещение вниз, чтобы в центре круга была мордочка, а не спина
        model.position.x = -center.x * scale;
        model.position.y = -center.y * scale - 0.12;
        model.position.z = -center.z * scale;

        model.rotation.y = baseRotationY;

        scene.add(model);

        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(model);
          
          // Выводим в консоль все названия анимаций (поможет, если текущая не подойдет)
          console.log("Доступные анимации:", gltf.animations.map(a => a.name));

          // Ищем анимацию покоя (Idle). Если не находим по имени, берем нулевую
          const idleClip = gltf.animations.find(clip => 
            clip.name.toLowerCase().includes("idle") || 
            clip.name.toLowerCase().includes("sit") || 
            clip.name.toLowerCase().includes("look")
          );

          // Если нулевая анимация — это умывание, мы можем принудительно взять следующую (часто 1 — это Idle)
          // Если кот снова начнет лизать лапу, поменяем (idleClip || gltf.animations[0]) на gltf.animations[1]
          const clipToPlay = idleClip || gltf.animations[0];

          if (clipToPlay) {
            const action = mixer.clipAction(clipToPlay);
            action.timeScale = 0.8;
            action.play();
          }
        }
      },
      undefined,
      (err: unknown) => console.warn("Ошибка загрузки 3D кота:", err)
    );

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      if (mixer) {
        mixer.update(delta * (isTypingRef.current ? 1.6 : 1.0));
      }

      if (model) {
        const desiredRotY = baseRotationY + targetRotation.y;
        const desiredRotX = targetRotation.x;
        
        model.rotation.y += (desiredRotY - model.rotation.y) * 0.06;
        model.rotation.x += (desiredRotX - model.rotation.x) * 0.06;

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
