addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Infraestructura Desplegada</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Sora:wght@300;600;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #0a0a0f;
      --surface: #12121a;
      --border: #1e1e2e;
      --accent: #22d3ee;
      --accent-glow: rgba(34, 211, 238, 0.15);
      --accent-alt: #a78bfa;
      --text: #e2e8f0;
      --text-dim: #64748b;
      --success: #34d399;
      --font-display: 'Sora', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    body {
      background: var(--bg);
      color: var(--text);
      font-family: var(--font-display);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* === GRID BACKGROUND === */
    .grid-bg {
      position: fixed;
      inset: 0;
      background-image:
        linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      z-index: 0;
    }

    .grid-bg::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse 600px 400px at 50% 30%, var(--accent-glow), transparent);
    }

    /* === LAYOUT === */
    .container {
      position: relative;
      z-index: 1;
      max-width: 960px;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }

    /* === NAV === */
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border);
      margin-bottom: 4rem;
      animation: fadeDown 0.6s ease-out;
    }

    .logo {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 1.1rem;
      color: var(--accent);
      letter-spacing: -0.5px;
    }

    .logo span { color: var(--text-dim); }

    .nav-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--success);
    }

    .pulse-dot {
      width: 8px;
      height: 8px;
      background: var(--success);
      border-radius: 50%;
      animation: pulse 2s infinite;
    }

    /* === HERO === */
    .hero {
      text-align: center;
      margin-bottom: 5rem;
    }

    .hero-tag {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--accent);
      background: var(--accent-glow);
      border: 1px solid rgba(34, 211, 238, 0.2);
      padding: 0.4rem 1rem;
      border-radius: 100px;
      margin-bottom: 2rem;
      animation: fadeUp 0.6s ease-out 0.1s both;
    }

    .hero h1 {
      font-size: clamp(2.5rem, 6vw, 4.2rem);
      font-weight: 800;
      line-height: 1.1;
      letter-spacing: -2px;
      margin-bottom: 1.5rem;
      animation: fadeUp 0.6s ease-out 0.2s both;
    }

    .hero h1 .gradient-text {
      background: linear-gradient(135deg, var(--accent), var(--accent-alt));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .hero p {
      font-size: 1.15rem;
      font-weight: 300;
      color: var(--text-dim);
      max-width: 540px;
      margin: 0 auto;
      line-height: 1.7;
      animation: fadeUp 0.6s ease-out 0.3s both;
    }

    /* === TERMINAL CARD === */
    .terminal {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 4rem;
      animation: fadeUp 0.8s ease-out 0.4s both;
      box-shadow: 0 20px 60px rgba(0,0,0,0.4);
    }

    .terminal-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.85rem 1.25rem;
      background: rgba(255,255,255,0.02);
      border-bottom: 1px solid var(--border);
    }

    .terminal-dot {
      width: 11px;
      height: 11px;
      border-radius: 50%;
    }

    .terminal-dot:nth-child(1) { background: #ff5f57; }
    .terminal-dot:nth-child(2) { background: #febc2e; }
    .terminal-dot:nth-child(3) { background: #28c840; }

    .terminal-title {
      flex: 1;
      text-align: center;
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-dim);
    }

    .terminal-body {
      padding: 1.5rem;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      line-height: 1.9;
    }

    .terminal-line {
      opacity: 0;
      animation: typeLine 0.4s ease-out forwards;
    }

    .terminal-line .prompt { color: var(--accent); }
    .terminal-line .cmd { color: var(--text); }
    .terminal-line .flag { color: var(--accent-alt); }
    .terminal-line .output { color: var(--success); }
    .terminal-line .comment { color: var(--text-dim); }
    .terminal-line .warn { color: #fbbf24; }

    .terminal-line:nth-child(1) { animation-delay: 0.8s; }
    .terminal-line:nth-child(2) { animation-delay: 1.2s; }
    .terminal-line:nth-child(3) { animation-delay: 1.6s; }
    .terminal-line:nth-child(4) { animation-delay: 2.0s; }
    .terminal-line:nth-child(5) { animation-delay: 2.4s; }
    .terminal-line:nth-child(6) { animation-delay: 2.8s; }
    .terminal-line:nth-child(7) { animation-delay: 3.2s; }
    .terminal-line:nth-child(8) { animation-delay: 3.6s; }

    /* === STATS GRID === */
    .stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 4rem;
    }

    .stat-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 1.5rem;
      text-align: center;
      transition: all 0.3s ease;
      animation: fadeUp 0.6s ease-out both;
    }

    .stat-card:nth-child(1) { animation-delay: 0.5s; }
    .stat-card:nth-child(2) { animation-delay: 0.6s; }
    .stat-card:nth-child(3) { animation-delay: 0.7s; }
    .stat-card:nth-child(4) { animation-delay: 0.8s; }

    .stat-card:hover {
      border-color: rgba(34, 211, 238, 0.3);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba(34, 211, 238, 0.08);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -1px;
      margin-bottom: 0.3rem;
    }

    .stat-value.cyan { color: var(--accent); }
    .stat-value.purple { color: var(--accent-alt); }
    .stat-value.green { color: var(--success); }
    .stat-value.yellow { color: #fbbf24; }

    .stat-label {
      font-family: var(--font-mono);
      font-size: 0.7rem;
      color: var(--text-dim);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* === FEATURES === */
    .features {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.25rem;
      margin-bottom: 4rem;
    }

    .feature {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 2rem;
      transition: all 0.3s ease;
      animation: fadeUp 0.6s ease-out both;
    }

    .feature:nth-child(1) { animation-delay: 0.6s; }
    .feature:nth-child(2) { animation-delay: 0.7s; }
    .feature:nth-child(3) { animation-delay: 0.8s; }

    .feature:hover {
      border-color: rgba(34, 211, 238, 0.2);
      transform: translateY(-2px);
    }

    .feature-icon {
      font-size: 1.8rem;
      margin-bottom: 1rem;
    }

    .feature h3 {
      font-size: 1.05rem;
      font-weight: 600;
      margin-bottom: 0.6rem;
    }

    .feature p {
      font-size: 0.88rem;
      color: var(--text-dim);
      line-height: 1.6;
      font-weight: 300;
    }

    /* === FOOTER === */
    footer {
      text-align: center;
      padding: 2.5rem 0;
      border-top: 1px solid var(--border);
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-dim);
      animation: fadeUp 0.6s ease-out 1s both;
    }

    footer a {
      color: var(--accent);
      text-decoration: none;
    }

    /* === ANIMATIONS === */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes fadeDown {
      from { opacity: 0; transform: translateY(-15px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes typeLine {
      from { opacity: 0; transform: translateX(-8px); }
      to { opacity: 1; transform: translateX(0); }
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.4); }
      50% { opacity: 0.8; box-shadow: 0 0 0 6px rgba(52, 211, 153, 0); }
    }

    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }

    .cursor {
      display: inline-block;
      width: 8px;
      height: 15px;
      background: var(--accent);
      animation: blink 1s step-end infinite;
      vertical-align: text-bottom;
      margin-left: 2px;
    }
  </style>
</head>
<body>
  <div class="grid-bg"></div>
  <div class="container">

    <nav>
      <div class="logo">terraform<span>.deploy</span></div>
      <div class="nav-status">
        <div class="pulse-dot"></div>
        Worker activo
      </div>
    </nav>

    <section class="hero">
      <div class="hero-tag">&#9889; Desplegado con Terraform Cloud</div>
      <h1>Desde GitHub test:<br><span class="gradient-text">Infraestructura como Código</span></h1>
      <p>Este worker fue desplegado automáticamente usando Terraform. Sin clicks, sin consolas, solo código declarativo.</p>
    </section>

    <div class="terminal">
      <div class="terminal-header">
        <div class="terminal-dot"></div>
        <div class="terminal-dot"></div>
        <div class="terminal-dot"></div>
        <span class="terminal-title">~/infra — terraform apply</span>
      </div>
      <div class="terminal-body">
        <div class="terminal-line"><span class="prompt">$ </span><span class="cmd">terraform init</span></div>
        <div class="terminal-line"><span class="output">  Terraform has been successfully initialized!</span></div>
        <div class="terminal-line"><span class="prompt">$ </span><span class="cmd">terraform plan</span> <span class="flag">-out=deploy.tfplan</span></div>
        <div class="terminal-line"><span class="output">  Plan: 3 to add, 0 to change, 0 to destroy.</span></div>
        <div class="terminal-line"><span class="prompt">$ </span><span class="cmd">terraform apply</span> <span class="flag">"deploy.tfplan"</span></div>
        <div class="terminal-line"><span class="output">  Apply complete! Resources: 3 added, 0 changed, 0 destroyed.</span></div>
        <div class="terminal-line"><span class="comment">  # Worker desplegado exitosamente &#10003;</span></div>
        <div class="terminal-line"><span class="prompt">$ </span><span class="cursor"></span></div>
      </div>
    </div>

    <div class="stats">
      <div class="stat-card">
        <div class="stat-value cyan" id="resources">0</div>
        <div class="stat-label">Recursos</div>
      </div>
      <div class="stat-card">
        <div class="stat-value purple" id="latency">0</div>
        <div class="stat-label">Latencia (ms)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value green">99.9%</div>
        <div class="stat-label">Uptime</div>
      </div>
      <div class="stat-card">
        <div class="stat-value yellow">0s</div>
        <div class="stat-label">Deploy Time</div>
      </div>
    </div>

    <div class="features">
      <div class="feature">
        <div class="feature-icon">&#128640;</div>
        <h3>Edge Computing</h3>
        <p>Este worker corre en el edge, cerca de tus usuarios. Respuestas ultra rápidas desde cualquier punto del planeta.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">&#128736;&#65039;</div>
        <h3>Infraestructura Declarativa</h3>
        <p>Definido en archivos .tf, versionado en Git, reproducible en cualquier momento. Infraestructura como debe ser.</p>
      </div>
      <div class="feature">
        <div class="feature-icon">&#128274;</div>
        <h3>Zero Trust</h3>
        <p>Sin servidores que mantener, sin puertos abiertos. Ejecuta código en un entorno aislado y seguro por defecto.</p>
      </div>
    </div>

    <footer>
      Desplegado con &#9829; usando <a href="https://www.terraform.io" target="_blank">Terraform</a> &middot; <span id="timestamp"></span>
    </footer>
  </div>

  <script>
    // Animated counters
    function animateCounter(el, target, suffix, duration) {
      const start = performance.now();
      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased) + (suffix || '');
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
    }

    setTimeout(() => {
      animateCounter(document.getElementById('resources'), 3, '', 1500);
      animateCounter(document.getElementById('latency'), 12, 'ms', 1500);
    }, 600);

    // Timestamp
    document.getElementById('timestamp').textContent = new Date().toLocaleString('es-ES', {
      dateStyle: 'long',
      timeStyle: 'short'
    });
  </script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}

// Compatible with module workers (Cloudflare Workers, Deno Deploy, etc.)
export default {
  async fetch(request, env, ctx) {
    return handleRequest(request);
  },
};
