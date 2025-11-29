import { lazy, Suspense } from 'react';

const Orb = lazy(() => import('./Orb'));

const LazyOrb = ({ hue = 160, hoverIntensity = 0.5, rotateOnHover = true, forceHoverState = false }) => {
  return (
    <Suspense fallback={<div className="orb-container" style={{ opacity: 0 }} />}>
      <Orb
        hue={hue}
        hoverIntensity={hoverIntensity}
        rotateOnHover={rotateOnHover}
        forceHoverState={forceHoverState}
      />
    </Suspense>
  );
};

export default LazyOrb;

