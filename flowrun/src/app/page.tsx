// src/app/page.tsx
"use client";

import dynamic from "next/dynamic";
import 'leaflet/dist/leaflet.css';


const FlowRun = dynamic(() => import("./components/FlowRun"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <FlowRun />
    </main>
  );
}
