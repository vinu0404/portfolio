"use client";
import { ShaderGradient, ShaderGradientCanvas } from "@shadergradient/react";

export default function GradientBg({ animate }: { animate: boolean }) {
  return (
    <ShaderGradientCanvas style={{ position: "absolute", inset: 0 }} pixelDensity={1} fov={45} pointerEvents="none">
      <ShaderGradient
        type="waterPlane"
        animate={animate ? "on" : "off"}
        uSpeed={0.12}
        uStrength={2.2}
        uDensity={1.1}
        uFrequency={4}
        color1="#dff1fb"
        color2="#36bcf7"
        color3="#c4b5fd"
        brightness={1.2}
        grain="off"
        lightType="3d"
        cDistance={4.2}
        cPolarAngle={95}
        cAzimuthAngle={180}
        positionX={0}
        positionY={0.6}
        positionZ={0}
        rotationX={0}
        rotationY={10}
        rotationZ={50}
      />
    </ShaderGradientCanvas>
  );
}
