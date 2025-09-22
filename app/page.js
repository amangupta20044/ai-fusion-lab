"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { setTheme } = useTheme();
  return (
    <div>
      <h2>Welcome to the AI Fusion Lab</h2>
      <Button>Get Started</Button>
  <Button onClick={() => { console.log('clicked'); setTheme('dark'); }}>Dark Mode</Button>
      <Button onClick={() => setTheme('light')}>Light Mode</Button>
    </div>
  );
}
