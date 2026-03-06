<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import gsap from 'gsap';

	let { ondone }: { ondone?: () => void } = $props();

	let percent = $state(0);
	let phase = $state<'constellation' | 'tracing' | 'charging' | 'ignition' | 'warp' | 'collapse'>('constellation');
	let glowIntensity = $state(0);
	let warpActive = $state(false);

	// DOM refs
	let preloader: HTMLElement;
	let wrapperEl: HTMLElement;
	let svgEl: SVGSVGElement;
	let starPath: SVGPathElement;
	let tracerDot: SVGCircleElement;
	let coreCircle: SVGCircleElement;
	let coreGlow: SVGCircleElement;
	let pulseRing: SVGCircleElement;
	let warpCanvas: HTMLCanvasElement;
	let warpOverlay: HTMLElement;

	let node0 = $state<SVGCircleElement | null>(null);
	let node1 = $state<SVGCircleElement | null>(null);
	let node2 = $state<SVGCircleElement | null>(null);
	let node3 = $state<SVGCircleElement | null>(null);
	let line0 = $state<SVGLineElement | null>(null);
	let line1 = $state<SVGLineElement | null>(null);
	let line2 = $state<SVGLineElement | null>(null);
	let line3 = $state<SVGLineElement | null>(null);

	let percentEl: HTMLElement;
	let labelEl: HTMLElement;
	let systemIdEl: HTMLElement;

	let counterInterval: ReturnType<typeof setInterval>;
	let masterTl: gsap.core.Timeline;
	let warpAnimFrame: number;

	const STAR_D = `M 0,-72
		C 8,-28 28,-8 72,0
		C 28,8 8,28 0,72
		C -8,28 -28,8 -72,0
		C -28,-8 -8,-28 0,-72 Z`;

	const NODES = [
		{ x: 0,   y: -72 },
		{ x: 72,  y: 0   },
		{ x: 0,   y: 72  },
		{ x: -72, y: 0   },
	];
	const LINES = [
		{ x1: 0,   y1: -72, x2: 72,  y2: 0   },
		{ x1: 72,  y1: 0,   x2: 0,   y2: 72  },
		{ x1: 0,   y1: 72,  x2: -72, y2: 0   },
		{ x1: -72, y1: 0,   x2: 0,   y2: -72 },
	];

	const nodeEls = () => [node0, node1, node2, node3];
	const lineEls = () => [line0, line1, line2, line3];

	// ── WARP STAR STREAKS ─────────────────────────────────────────
	interface WarpStar {
		x: number; y: number;
		z: number; pz: number;
		color: string;
	}

	let warpStars: WarpStar[] = [];
	let warpSpeed = 0;
	let warpStartTime = 0;

	function initWarpStars(count: number) {
		const colors = ['#B4FF00', '#ffffff', '#00E5FF', '#d4ff80', '#aaffee'];
		warpStars = Array.from({ length: count }, () => ({
			x: (Math.random() - 0.5) * 2,
			y: (Math.random() - 0.5) * 2,
			z: Math.random(),
			pz: Math.random(),
			color: colors[Math.floor(Math.random() * colors.length)],
		}));
	}

	function drawWarp(progress: number) {
		if (!warpCanvas) return;
		const ctx = warpCanvas.getContext('2d')!;
		const W = warpCanvas.width;
		const H = warpCanvas.height;
		const cx = W / 2;
		const cy = H / 2;

		// Speed curve — ease in then explosive
		warpSpeed = Math.pow(progress, 2.2) * 38;

		// Slight trail fade (shorter = more trails)
		const trailOpacity = 0.12 + progress * 0.55;
		ctx.fillStyle = `rgba(0, 0, 5, ${trailOpacity})`;
		ctx.fillRect(0, 0, W, H);

		// Central warp-lens vignette — grows with progress
		const vignR = progress * Math.max(W, H) * 0.65;
		if (vignR > 0) {
			const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, vignR);
			grad.addColorStop(0,   `rgba(180,255,0,${progress * 0.06})`);
			grad.addColorStop(0.4, `rgba(0,229,255,${progress * 0.03})`);
			grad.addColorStop(1,   'rgba(0,0,0,0)');
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, W, H);
		}

		for (const star of warpStars) {
			star.pz = star.z;
			star.z -= warpSpeed * 0.012;
			if (star.z <= 0) {
				star.x  = (Math.random() - 0.5) * 2;
				star.y  = (Math.random() - 0.5) * 2;
				star.z  = 1;
				star.pz = 1;
			}

			// Project to screen
			const sx  = (star.x  / star.z)  * cx + cx;
			const sy  = (star.y  / star.z)  * cy + cy;
			const spx = (star.x  / star.pz) * cx + cx;
			const spy = (star.y  / star.pz) * cy + cy;

			const size   = (1 - star.z) * (1.8 + progress * 3.5);
			const alpha  = Math.min(1, (1 - star.z) * (0.6 + progress * 0.5));
			const streak = progress > 0.3;

			if (streak && (Math.abs(sx - spx) > 0.5 || Math.abs(sy - spy) > 0.5)) {
				ctx.beginPath();
				ctx.moveTo(spx, spy);
				ctx.lineTo(sx, sy);
				ctx.strokeStyle = star.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
				ctx.lineWidth = size * 0.5;
				ctx.stroke();
			} else {
				ctx.beginPath();
				ctx.arc(sx, sy, Math.max(0.3, size * 0.4), 0, Math.PI * 2);
				ctx.fillStyle = star.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
				ctx.fill();
			}
		}

		// Central bright flare at full warp
		if (progress > 0.7) {
			const flareAlpha = (progress - 0.7) / 0.3;
			const flare = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120 * flareAlpha);
			flare.addColorStop(0,   `rgba(255,255,255,${flareAlpha * 0.9})`);
			flare.addColorStop(0.3, `rgba(180,255,0,${flareAlpha * 0.4})`);
			flare.addColorStop(1,   'rgba(0,0,0,0)');
			ctx.fillStyle = flare;
			ctx.fillRect(0, 0, W, H);
		}
	}

	function animateWarp() {
		const elapsed = (performance.now() - warpStartTime) / 1000;
		const duration = 1.8; // seconds for warp buildup
		const progress = Math.min(elapsed / duration, 1);

		drawWarp(progress);

		if (progress < 1) {
			warpAnimFrame = requestAnimationFrame(animateWarp);
		}
	}

	onMount(() => {
		masterTl = gsap.timeline();
		runPhase1_Constellation();
	});

	// ─── PHASE 1 ───────────────────────────────────────────────────
	function runPhase1_Constellation() {
		phase = 'constellation';
		const nodes = nodeEls();
		const lines = lineEls();

		gsap.set(nodes, { opacity: 0, scale: 0, transformOrigin: '50% 50%' });
		gsap.set(lines, { opacity: 0, strokeDasharray: 150, strokeDashoffset: 150 });
		gsap.set(starPath, { opacity: 0 });
		gsap.set([tracerDot, coreCircle, coreGlow, pulseRing], { opacity: 0 });
		gsap.set(percentEl, { opacity: 0 });
		gsap.set(labelEl, { opacity: 0, y: 10 });
		gsap.set(systemIdEl, { opacity: 0 });

		const tl = gsap.timeline({ onComplete: runPhase2_Tracing });
		nodes.forEach((node, i) => {
			tl.to(node, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, i * 0.22);
		});
		lines.forEach((line, i) => {
			tl.to(line, { opacity: 0.35, strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut' }, 0.15 + i * 0.22);
		});
		tl.to(labelEl,    { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 0.4);
		tl.to(systemIdEl, { opacity: 1, duration: 0.5 }, 0.7);
		tl.to(percentEl,  { opacity: 1, duration: 0.4 }, 0.8);
	}

	// ─── PHASE 2 ───────────────────────────────────────────────────
	function runPhase2_Tracing() {
		phase = 'tracing';
		const pathLength = starPath.getTotalLength();
		gsap.set(starPath, {
			opacity: 1, strokeDasharray: pathLength,
			strokeDashoffset: pathLength, stroke: '#B4FF00',
			strokeWidth: 1.2, fill: 'none',
		});
		gsap.set(tracerDot, { opacity: 1 });

		const tl = gsap.timeline({ onComplete: runPhase3_Charging });
		tl.to({ t: 0 }, {
			t: 1, duration: 2.2, ease: 'power1.inOut',
			onUpdate: function () {
				const pt = starPath.getPointAtLength(this.targets()[0].t * pathLength);
				gsap.set(tracerDot, { attr: { cx: pt.x, cy: pt.y } });
			}
		});
		tl.to(starPath, { strokeDashoffset: 0, duration: 2.2, ease: 'power1.inOut' }, 0.04);
		tl.to(lineEls(), { opacity: 0.1, duration: 0.8 }, 0.5);
		tl.to(nodeEls(), { opacity: 0.4, scale: 0.7, duration: 0.8 }, 0.6);
	}

	// ─── PHASE 3 ───────────────────────────────────────────────────
	function runPhase3_Charging() {
		phase = 'charging';
		gsap.set(tracerDot, { opacity: 0 });
		gsap.to(lineEls(), { opacity: 0, duration: 0.5 });
		gsap.to(nodeEls(), { opacity: 0, duration: 0.5 });

		counterInterval = setInterval(() => {
			if (percent < 100) {
				percent += 1;
				glowIntensity = percent / 100;
			} else {
				clearInterval(counterInterval);
				setTimeout(runPhase4_Ignition, 300);
			}
		}, 45);
	}

	// ─── PHASE 4: Ignition ────────────────────────────────────────
	function runPhase4_Ignition() {
		phase = 'ignition';

		const tl = gsap.timeline({
			onComplete: () => { setTimeout(runPhase5_Warp, 400); },
		});

		tl.to(coreCircle, { opacity: 1, duration: 0.3, ease: 'power2.out' });
		tl.to(coreGlow,   { opacity: 0.6, duration: 0.3 }, 0);
		tl.to(coreCircle, { attr: { r: 5 }, duration: 0.15, ease: 'power4.out' });
		tl.to(coreGlow,   { opacity: 1, attr: { r: 14 }, duration: 0.15 }, '<');
		tl.set(pulseRing, { opacity: 0.9, attr: { r: 5 } });
		tl.to(pulseRing, { attr: { r: 90 }, opacity: 0, duration: 0.9, ease: 'power2.out' });
		tl.to(starPath, { strokeWidth: 2.0, duration: 0.15, ease: 'power4.out' }, '-=0.85');
		tl.to(starPath, { strokeWidth: 1.2, duration: 0.4,  ease: 'power2.inOut' });
		tl.to(coreCircle, { attr: { r: 3 },  duration: 0.4, ease: 'power2.inOut' });
		tl.to(coreGlow,   { attr: { r: 10 }, opacity: 0.7, duration: 0.4 }, '<');
	}

	// ─── PHASE 5: WARP JUMP — NEW ────────────────────────────────
	function runPhase5_Warp() {
		phase = 'warp';
		warpActive = true;

		// Resize canvas
		warpCanvas.width  = window.innerWidth;
		warpCanvas.height = window.innerHeight;

		initWarpStars(320);
		warpStartTime = performance.now();

		// 1. Star logo spins faster and faster, shrinks to singularity
		const spinTl = gsap.timeline();

		spinTl.to(wrapperEl, {
			rotation: 720,
			scale: 1.15,
			duration: 0.6,
			ease: 'power2.in',
			transformOrigin: '50% 50%',
		});

		// Glow erupts
		spinTl.to(svgEl, {
			filter: 'drop-shadow(0 0 40px rgba(180,255,0,1)) drop-shadow(0 0 80px rgba(0,229,255,0.8)) drop-shadow(0 0 120px rgba(180,255,0,0.5))',
			duration: 0.3,
		}, 0.3);

		// Continue spinning — accelerate massively
		spinTl.to(wrapperEl, {
			rotation: '+=1800',
			scale: 0.0,
			duration: 1.1,
			ease: 'power3.in',
			transformOrigin: '50% 50%',
		}, 0.55);

		// Labels fade out early
		spinTl.to([percentEl, labelEl, systemIdEl], {
			opacity: 0, y: -8, duration: 0.3, ease: 'power2.in',
		}, 0);

		// Warp canvas fades in
		spinTl.to(warpOverlay, {
			opacity: 1, duration: 0.2,
		}, 0.4);

		// Begin warp star animation
		animateWarp();

		// Flash white at peak
		spinTl.to(warpOverlay, {
			backgroundColor: 'rgba(255,255,255,0.95)',
			duration: 0.12,
			ease: 'power4.out',
		}, 1.5);

		spinTl.to(warpOverlay, {
			backgroundColor: 'rgba(0,0,5,0)',
			duration: 0.15,
		}, 1.62);

		// Fade entire preloader out
		spinTl.to(preloader, {
			opacity: 0,
			duration: 0.35,
			ease: 'power2.in',
			onComplete: () => {
				cancelAnimationFrame(warpAnimFrame);
				ondone?.();
			},
		}, 1.55);
	}

	onDestroy(() => {
		if (!browser) return;
		clearInterval(counterInterval);
		cancelAnimationFrame(warpAnimFrame);
		masterTl?.kill();
	});

	// Dynamic glow driven by percent
	$effect(() => {
		if (phase === 'charging' && svgEl) {
			const t = glowIntensity;
			const inner   = 3  + t * 12;
			const outer   = 8  + t * 35;
			const opacity = 0.4 + t * 0.6;
			svgEl.style.filter = `drop-shadow(0 0 ${inner}px rgba(180,255,0,${opacity})) drop-shadow(0 0 ${outer}px rgba(180,255,0,${opacity * 0.4}))`;
		}
	});
</script>

<div bind:this={preloader} class="preloader">

	<!-- Ambient depth rings -->
	<div class="ambient-ring ring-1"></div>
	<div class="ambient-ring ring-2"></div>
	<div class="ambient-ring ring-3"></div>

	<!-- ── WARP CANVAS — sits behind everything, hidden until warp ── -->
	<canvas
		bind:this={warpCanvas}
		class="warp-canvas"
	></canvas>

	<!-- ── WARP OVERLAY — white flash layer ── -->
	<div bind:this={warpOverlay} class="warp-overlay"></div>

	<!-- Main stellar container -->
	<div bind:this={wrapperEl} class="stellar-wrapper">
		<svg
			bind:this={svgEl}
			class="stellar-svg"
			viewBox="-110 -110 220 220"
			xmlns="http://www.w3.org/2000/svg"
		>
			<defs>
				<filter id="node-glow" x="-200%" y="-200%" width="500%" height="500%">
					<feGaussianBlur stdDeviation="3" result="blur"/>
					<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
				</filter>
				<filter id="core-glow" x="-500%" y="-500%" width="1100%" height="1100%">
					<feGaussianBlur stdDeviation="6" result="blur"/>
					<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
				</filter>
				<radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
					<stop offset="0%"   stop-color="#FFFFFF" stop-opacity="1"/>
					<stop offset="40%"  stop-color="#E8FF80" stop-opacity="1"/>
					<stop offset="100%" stop-color="#B4FF00" stop-opacity="0"/>
				</radialGradient>
			</defs>

			<!-- Constellation lines -->
			<line bind:this={line0} x1={LINES[0].x1} y1={LINES[0].y1} x2={LINES[0].x2} y2={LINES[0].y2}
				stroke="#B4FF00" stroke-width="0.5" opacity="0" stroke-dasharray="150" stroke-dashoffset="150"/>
			<line bind:this={line1} x1={LINES[1].x1} y1={LINES[1].y1} x2={LINES[1].x2} y2={LINES[1].y2}
				stroke="#B4FF00" stroke-width="0.5" opacity="0" stroke-dasharray="150" stroke-dashoffset="150"/>
			<line bind:this={line2} x1={LINES[2].x1} y1={LINES[2].y1} x2={LINES[2].x2} y2={LINES[2].y2}
				stroke="#B4FF00" stroke-width="0.5" opacity="0" stroke-dasharray="150" stroke-dashoffset="150"/>
			<line bind:this={line3} x1={LINES[3].x1} y1={LINES[3].y1} x2={LINES[3].x2} y2={LINES[3].y2}
				stroke="#B4FF00" stroke-width="0.5" opacity="0" stroke-dasharray="150" stroke-dashoffset="150"/>

			<!-- Constellation nodes -->
			<circle bind:this={node0} cx={NODES[0].x} cy={NODES[0].y} r="3" fill="#B4FF00" opacity="0" filter="url(#node-glow)"/>
			<circle bind:this={node1} cx={NODES[1].x} cy={NODES[1].y} r="3" fill="#B4FF00" opacity="0" filter="url(#node-glow)"/>
			<circle bind:this={node2} cx={NODES[2].x} cy={NODES[2].y} r="3" fill="#B4FF00" opacity="0" filter="url(#node-glow)"/>
			<circle bind:this={node3} cx={NODES[3].x} cy={NODES[3].y} r="3" fill="#B4FF00" opacity="0" filter="url(#node-glow)"/>

			<!-- Star path -->
			<path bind:this={starPath} d={STAR_D}
				stroke="#B4FF00" stroke-width="1.2" fill="none" opacity="0"
				stroke-linecap="round" stroke-linejoin="round"/>

			<!-- Tracer dot -->
			<circle bind:this={tracerDot} cx="0" cy="-72" r="3" fill="#FFFFFF" opacity="0" filter="url(#node-glow)"/>

			<!-- Core glow -->
			<circle bind:this={coreGlow} cx="0" cy="0" r="10" fill="url(#core-grad)" opacity="0" filter="url(#core-glow)"/>

			<!-- Core circle -->
			<circle bind:this={coreCircle} cx="0" cy="0" r="3" fill="#E8FF80" opacity="0" filter="url(#node-glow)"/>

			<!-- Pulse ring -->
			<circle bind:this={pulseRing} cx="0" cy="0" r="5"
				fill="none" stroke="#B4FF00" stroke-width="0.6" opacity="0"/>
		</svg>

		<!-- Percent counter -->
		<div bind:this={percentEl} class="percent-display">
			<span class="percent-value">{percent}</span>
			<span class="percent-symbol">%</span>
		</div>
	</div>

	<!-- Labels outside wrapper -->
	<div class="ui-labels">
		<div bind:this={labelEl} class="system-label">INITIALIZING STELLAR SYSTEM</div>
		<div bind:this={systemIdEl} class="system-id">
			SYS · {`0x${Math.floor(Math.random() * 0xFFFF).toString(16).toUpperCase().padStart(4, '0')}`} · ONLINE
		</div>
	</div>

</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;600&family=Share+Tech+Mono&display=swap');

	.preloader {
		position: fixed;
		inset: 0;
		background: #000005;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		z-index: 9999;
		overflow: hidden;
		font-family: 'Share Tech Mono', monospace;
	}

	/* ── WARP CANVAS ── */
	.warp-canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 1;
		/* starts hidden — JS draws into it, opacity controlled by gsap */
	}

	/* ── WARP FLASH OVERLAY ── */
	.warp-overlay {
		position: absolute;
		inset: 0;
		pointer-events: none;
		z-index: 10;
		opacity: 0;
		background: transparent;
	}

	/* Ambient depth rings */
	.ambient-ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid transparent;
		pointer-events: none;
		animation: ambientPulse 6s ease-in-out infinite;
		z-index: 2;
	}
	.ring-1 { width: 320px; height: 320px; animation-delay: 0s;   border-color: rgba(180,255,0,0.04); }
	.ring-2 { width: 520px; height: 520px; animation-delay: 1.5s; border-color: rgba(180,255,0,0.025); }
	.ring-3 { width: 720px; height: 720px; animation-delay: 3s;   border-color: rgba(0,229,255,0.015); }

	@keyframes ambientPulse {
		0%, 100% { opacity: 0.4; transform: scale(1); }
		50%       { opacity: 1;   transform: scale(1.02); }
	}

	.stellar-wrapper {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		will-change: transform;
		z-index: 5;
	}

	.stellar-svg {
		width: 280px;
		height: 280px;
		overflow: visible;
		transition: filter 0.3s ease;
		filter: drop-shadow(0 0 3px rgba(180,255,0,0.2));
	}

	.percent-display {
		margin-top: 2rem;
		display: flex;
		align-items: baseline;
		gap: 2px;
		letter-spacing: 0.05em;
		will-change: opacity;
	}
	.percent-value {
		font-family: 'Rajdhani', sans-serif;
		font-weight: 300;
		font-size: 2.4rem;
		color: #F5F5F5;
		min-width: 3ch;
		text-align: right;
		line-height: 1;
		font-variant-numeric: tabular-nums;
	}
	.percent-symbol {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.85rem;
		color: rgba(180,255,0,0.6);
		letter-spacing: 0.2em;
	}

	.ui-labels {
		position: absolute;
		bottom: clamp(2.5rem, 6vh, 5rem);
		left: 0;
		right: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.6rem;
		pointer-events: none;
		z-index: 5;
	}
	.system-label {
		font-family: 'Rajdhani', sans-serif;
		font-weight: 600;
		font-size: 0.7rem;
		letter-spacing: 0.45em;
		color: rgba(245,245,245,0.45);
		text-transform: uppercase;
	}
	.system-id {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.62rem;
		letter-spacing: 0.3em;
		color: rgba(0,229,255,0.3);
		text-transform: uppercase;
	}
</style>