"use client";
import { useEffect } from "react";
import { useRive, useStateMachineInput } from "@rive-app/react-canvas";

export default function RiveCanvas({ src }: { src: string }) {
  const { rive, RiveComponent } = useRive({ src, stateMachines: "Logo", autoplay: true });
  const hover = useStateMachineInput(rive, "Logo", "hover", false);
  const loaded = useStateMachineInput(rive, "Logo", "loaded");

  useEffect(() => {
    loaded?.fire();
  }, [loaded]);

  return (
    <RiveComponent
      aria-label="Vinay Kumar"
      role="img"
      onMouseEnter={() => hover && (hover.value = true)}
      onMouseLeave={() => hover && (hover.value = false)}
    />
  );
}
