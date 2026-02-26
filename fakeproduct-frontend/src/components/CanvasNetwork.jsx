import React, { useEffect, useRef } from "react";

/**
 * CanvasNetwork - animated canvas background (bold lines + nodes).
 * Drop it as a top-level background in each dashboard page.
 */
export default function CanvasNetwork({ intensity = 1 }) {
  const ref = useRef();

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const spawnScale = Math.max(22, Math.floor((w * h) / 120000));
    const NODE_COUNT = spawnScale;
    const MAX_DIST = 180; // larger = more connections
    const nodes = [];

    function rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    function init() {
      nodes.length = 0;
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: rand(-0.35, 0.35),
          vy: rand(-0.35, 0.35),
          r: rand(1.8, 3.6),
          hue: 195 + rand(-10, 10),
          glow: rand(0.25, 0.9),
        });
      }
    }

    let mouse = { x: w / 2, y: h / 2, active: false };

    function onMove(e) {
      mouse.active = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }
    function onLeave() {
      mouse.active = false;
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);
    function onResize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      init();
    }
    window.addEventListener("resize", onResize);

    init();
    let raf = null;

    function draw() {
      ctx.clearRect(0, 0, w, h);

      // background gradient
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "rgba(2,6,15,0.85)");
      g.addColorStop(1, "rgba(4,9,20,0.85)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // draw lines
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];

        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            // stronger alpha for closer nodes
            const alpha = Math.min(0.35, (0.6 * (1 - dist / MAX_DIST)) * intensity);
            ctx.strokeStyle = `rgba(56,189,248,${alpha})`;
            ctx.lineWidth = 1.4 * intensity;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // draw glow nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // interactive brightness with cursor
        let distToMouse = Math.hypot(n.x - mouse.x, n.y - mouse.y);
        let mouseBoost = mouse.active ? Math.max(0, (1 - distToMouse / 300)) : 0;

        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 7 * intensity);
        grd.addColorStop(0, `rgba(56,189,248,${0.7 * (n.glow + mouseBoost)})`);
        grd.addColorStop(0.2, `rgba(56,189,248,${0.18 * (n.glow + mouseBoost)})`);
        grd.addColorStop(1, "rgba(2,6,15,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * 7 * intensity, 0, Math.PI * 2);
        ctx.fill();

        // core dot
        ctx.fillStyle = `rgba(56,189,248,${0.95 * (n.glow + mouseBoost)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * intensity, 0, Math.PI * 2);
        ctx.fill();
      }

      // move nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        // bounce
        if (n.x < -50 || n.x > w + 50) n.vx *= -1;
        if (n.y < -50 || n.y > h + 50) n.vy *= -1;
        // subtle change
        n.vx += rand(-0.015, 0.015) * 0.07;
        n.vy += rand(-0.015, 0.015) * 0.07;
      }

      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
      window.removeEventListener("resize", onResize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        mixBlendMode: "screen",
      }}
    />
  );
}
