"use client";

import P5Canvas from "@/components/P5Canvas";
import { sampleSketch } from "@/sketches/sampleSketch";

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <P5Canvas sketch={sampleSketch} className="w-full h-full" />
    </div>
  );
}
