import React, { useMemo } from "react";
import {
  TextureLoader,
  sRGBEncoding,
  PMREMGenerator,
  DefaultLoadingManager,
  ACESFilmicToneMapping,
} from "three";
import { useLoader, useThree } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { useModel } from "../state/Store";

export default function Model() {
  const { scene, gl } = useThree();
  const { setModel, setScene, setLightMaps } = useModel((state) => state);
  const loader = new GLTFLoader();
  const pmremGenerator = new PMREMGenerator(gl);
  var pngCubeRenderTarget, pngBackground, envMap;

  // let  = textures;

  useMemo(() => {
    DefaultLoadingManager.onLoad = () => pmremGenerator.dispose();

    // setLightMaps({
    //   empty: [Empty_ExteriorMap, Empty_FurnitureMap],
    //   nonEmpty: [ExteriorMap, FurnitureMap],
    // });

    setScene(scene);

    const textureLoader = new TextureLoader();

    textureLoader.load("/assets/environment/hall_envMap.webp", (texture) => {
      texture.encoding = sRGBEncoding;
      pngCubeRenderTarget = pmremGenerator.fromEquirectangular(texture);
      pngBackground = pngCubeRenderTarget.texture;
      texture.dispose();

      envMap = pngCubeRenderTarget.texture;
    });

    pmremGenerator.compileEquirectangularShader();

    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 4;
    gl.outputEncoding = sRGBEncoding;
    gl.physicallyCorrectLights = true;
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco-gltf/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      // resource URL
      "/Sponza.gltf",
      // called when the resource is loaded
      function (gltf) {
        setModel(gltf.scene);

        scene.add(gltf.scene);

        gltf.scene.traverse((o) => {
           if (o.isMesh) {
            console.log(o.name);
            // o.material.envMap = envMap;
            // o.material.envMapIntensity = 0.2;
            // o.material.lightMapIntensity = 2;
          }
        });
      },
      (data) => {
        // Handle the loaded data
        console.log('File loaded successfully');
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(`Loading: ${Math.round(percentComplete, 2)}% complete`);
        } else {
          console.log(`Loading: ${xhr.loaded} bytes loaded`);
        }
      },
      (error) => {
        console.error('An error happened', error);
      }
      // // called while loading is progressing
      // function (xhr) {
      //   console.log(xhr);
        
      //   console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
      // },
      // // called when loading has errors
      // function (error) {
      //   throw error;
      //   // console.log("An error happened", error);
      // }
    );
  }, []);

  // useMemo(() => {

  // }, []);

  return <></>;
}
