import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { registerAppWorker } from "@/lib/pwa";

interface InstallPrompt extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallApp() {
  const [prompt, setPrompt] = useState<InstallPrompt | null>(null);
  const [installing, setInstalling] = useState(false);
  useEffect(() => {
    void registerAppWorker().catch((error: unknown) => console.warn("Offline support could not start", error));
    const onPrompt = (event: Event) => {
      if (window.matchMedia("(display-mode: standalone)").matches) return;
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const installed = () => setPrompt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", installed);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", installed);
    };
  }, []);
  if (!prompt) return null;
  const install = async () => {
    setInstalling(true);
    try { await prompt.prompt(); await prompt.userChoice; }
    finally { setPrompt(null); setInstalling(false); }
  };
  return <Button variant="secondary" onClick={() => { void install().catch(() => undefined); }} disabled={installing} className="min-h-11 px-3" aria-label="Install CurrencyX app" title="Install CurrencyX app"><Download size={18} /><span className="hidden sm:inline">Install app</span></Button>;
}