import { useEffect, useState } from "react";

export default function HudClock() {
  const [stamp, setStamp] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setStamp(
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-mute">
      ECE · <span className="text-cyan">{stamp}</span>
    </p>
  );
}
