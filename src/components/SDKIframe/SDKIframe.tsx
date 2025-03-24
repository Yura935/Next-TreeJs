import { useMPSdk } from "@/hooks";
import { useEffect } from "react";
import * as THREE from "three";

import styles from './SDKIframe.module.css';

export const SDKIframe = () => {
  const sdkKey = process.env.NEXT_PUBLIC_SDK_KEY;
  const modelSid = process.env.NEXT_PUBLIC_MODEL_SID;
  const tagPosition = {
    x: 22.3371524810791,
    y: 1.5914766788482666,
    z: -5.08831262588501,
  };
  const model3DUrl =
    "https://cdn.jsdelivr.net/gh/mrdoob/three.js@dev/examples/models/fbx/stanford-bunny.fbx";
  const mpSdk = useMPSdk();

  const addTag = () => {
    const customTag = {
      label: "Office",
      description: "Test tag",
      anchorPosition: tagPosition,
      stemVector: {
        x: 0,
        y: 0,
        z: 0,
      },
      color: {
        r: 0.0,
        g: 0.0,
        b: 1.0,
      },
    };
    mpSdk?.Tag.add(customTag);
  };

  const add3DModel = async () => {
    try {
      if (!mpSdk) {
        console.error("❌ mpSdk is not initialized.");
        return;
      }

      // Створюємо об'єкт сцени
      const [sceneObject] = await mpSdk.Scene.createObjects(1);

      // Додаємо світло (приклад)
      const lights = sceneObject.addNode();
      lights.addComponent("mp.lights");
      lights.start();

      // Додаємо 3D модель (FBX)
      const modelNode = sceneObject.addNode() as any;

      const fbxComponent = modelNode.addComponent(
        mpSdk.Scene.Component.FBX_LOADER,
        {
          url: model3DUrl,
        }
      );

      if (!fbxComponent) {
        console.error("❌ Failed to create FBX component.");
        return;
      }

      // Ensure the 'inputs' property exists before accessing it
      if (!fbxComponent.inputs) {
        console.error("❌ fbxComponent.inputs is undefined.");
        return;
      }

      // Встановлюємо масштаб моделі
      fbxComponent.inputs.localScale = {
        x: 0.00002,
        y: 0.00002,
        z: 0.00002,
      };

      // Встановлюємо позицію моделі через Three.js
      // const model3D = fbxComponent.outputs?.objectRoot; // Це об'єкт Three.js
      const model3D = modelNode.obj3D; // Це об'єкт Three.js

      const position = new THREE.Vector3(tagPosition.x, 0.3, tagPosition.z); // Створення вектору позиції

      model3D?.position.copy(position); // Копіюємо позицію у об'єкт Three.js

      // Використовуємо Three.js для ротації, якщо потрібно
      model3D?.rotation.set(0, Math.PI / 4, 0); // Ротація моделі на 45 градусів по осі Y

      // Запускаємо модель
      modelNode.start();
    } catch (error) {
      console.error("❌ Помилка додавання 3D-моделі:", error);
    }
  };

  useEffect(() => {
    if (mpSdk) {
      addTag();
      add3DModel();
    }
  }, [mpSdk]);

  //   if (!mpSdk) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <iframe
      className={styles.showcase}
      id="showcase"
      src={`/bundle/showcase.html?m=${modelSid}&applicationKey=${sdkKey}`}
      frameBorder="0"
      allowFullScreen
    />
  );
};
