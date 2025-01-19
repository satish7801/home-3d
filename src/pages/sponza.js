import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from 'react-three-fiber';
import Navbar from '../components/UI/Navbar';
import Camera from '../components/Camera';
import FloorCircle from '../components/FloorCircle';
import Instructions from '../components/UI/Instructions';
import LoadingManager from '../components/LoadingManager';
import { withResizeDetector } from 'react-resize-detector';

const Controls = React.lazy(() => import("../components/Controls"));
const Model = React.lazy(() => import("../models/Sponza"));

const config = {
  controls: {
    floorCircle: { yLevel: -0.03 },
  },
  camera: {},
};

const steps = [
  {
    selector: '.first-step',
    content: 'This is the first step',
  },
];

const Sponza = ({ width }) => {
  const [fov, setFov] = useState(55);
  const [isTourOpen, setIsTourOpen] = useState(true);

  useEffect(() => {
    if (width < 500) {
      setFov(85);
    } else {
      setFov(55);
    }
  }, [width]);

  return (
    <>
      <Canvas gl={{ antialias: true }}>
        <LoadingManager total={46} />
        <Camera fov={fov} position={[1, 1.37, 0]} lookAt={[0, 0, 10]} />
        <Suspense fallback={'Loading..'}>
          <FloorCircle />
          <Model name={'Sponza'} />
          <Controls settings={config.controls} />
        </Suspense>
      </Canvas>
      <Instructions />
      <Navbar />
    </>
  );
};

export default withResizeDetector(Sponza);
