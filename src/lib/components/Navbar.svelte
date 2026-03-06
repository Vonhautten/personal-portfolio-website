<script lang="ts">
	import { onMount } from 'svelte';
	import AudioToggle from '$lib/components/AudioToggle.svelte';

	let scrolled = false;
	let menuOpen = false;
	let activeSection = 'home'; // default hero

	const navLinks = [
		{ href: '#profile', label: 'Profile' },
		{ href: '#projects', label: 'Projects' },
		{ href: '#contact', label: 'Contact' },
	];

	// True saat user ada di section hero (id="home")
	$: isAtHero = activeSection === 'home' || activeSection === '';

	function smoothScroll(e: MouseEvent, href: string) {
		e.preventDefault();
		menuOpen = false;
		const target = document.querySelector(href);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}

	onMount(() => {
		const handleScroll = () => {
			scrolled = window.scrollY > 50;

			// Track semua section termasuk home
			const sections = ['home', 'profile', 'projects', 'contact'];
			let current = 'home';

			for (const id of sections) {
				const el = document.getElementById(id);
				if (el) {
					const rect = el.getBoundingClientRect();
					if (rect.top <= 150) {
						current = id;
					}
				}
			}

			activeSection = current;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		// Run sekali untuk set state awal
		handleScroll();

		return () => window.removeEventListener('scroll', handleScroll);
	});
</script>

<!-- Backdrop for mobile menu -->
{#if menuOpen}
	<div
		class="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
		on:click={() => (menuOpen = false)}
		role="presentation"
	></div>
{/if}

<nav
	class="fixed top-0 w-full z-40 px-6 md:px-10 py-4 md:py-5 flex justify-between items-center transition-all duration-500"
	class:scrolled
>
	<!-- Left: Audio Toggle -->
	<div class="flex items-center z-10">
		<AudioToggle />
	</div>

	<!-- Center: ✦ Sparkle Logo dengan hero indicator -->
	<button
		class="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group cursor-pointer select-none z-10 bg-transparent border-0 p-0"
		on:click={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
		aria-label="Back to top"
	>
		<div class="relative flex items-center justify-center">

			{#if isAtHero}
				<!-- Ping ring terluar -->
				<div
					class="absolute rounded-full pointer-events-none"
					style="
						width: 38px; height: 38px;
						border: 1px solid rgba(180,255,0,0.5);
						animation: hero-ping 2s ease-out infinite;
					"
				></div>

				<!-- Ring tengah -->
				<div
					class="absolute rounded-full pointer-events-none"
					style="
						width: 28px; height: 28px;
						border: 1px solid rgba(180,255,0,0.3);
						animation: hero-ping 2s ease-out infinite 0.4s;
					"
				></div>

				<!-- Glow backdrop -->
				<div
					class="absolute w-10 h-10 rounded-full pointer-events-none"
					style="background: radial-gradient(circle, rgba(180,255,0,0.15) 0%, transparent 70%);"
				></div>
			{:else}
				<!-- Normal mode -->
				<div
					class="absolute w-7 h-7 rounded-full border border-[#B4FF00]/10 group-hover:border-[#B4FF00]/35 transition-all duration-700 orbit-ring"
				></div>
				<div
					class="absolute w-10 h-10 rounded-full border border-[#B4FF00]/5 group-hover:border-[#B4FF00]/15 transition-all duration-700 orbit-ring-reverse"
				></div>
			{/if}

			<!-- Sparkle icon -->
			<span
				class="sparkle-icon relative z-10 text-2xl md:text-3xl font-light leading-none transition-all duration-500"
				style="
					color: #B4FF00;
					text-shadow: {isAtHero
						? '0 0 14px rgba(180,255,0,1), 0 0 30px rgba(180,255,0,0.4)'
						: '0 0 8px rgba(180,255,0,0.7), 0 0 20px rgba(180,255,0,0.3)'};
					transform: scale({isAtHero ? 1.1 : 1});
				"
			>✦</span>
		</div>

		{#if isAtHero}
			<span
				class="font-mono text-[7px] text-[#B4FF00]/50 tracking-[0.3em] mt-1 uppercase"
				style="animation: fade-in 0.4s ease;"
			>HOME</span>
		{/if}
	</button>

	<!-- Right: Desktop Nav links -->
	<div class="hidden md:flex items-center gap-8 z-10">
		{#each navLinks as link}
			<a
				href={link.href}
				on:click={(e) => smoothScroll(e, link.href)}
				class="nav-link text-sm tracking-widest uppercase font-light transition-all duration-300"
				class:active={activeSection === link.href.replace('#', '')}
			>
				{link.label}
			</a>
		{/each}
	</div>

	<!-- Right: Mobile Hamburger -->
	<button
		class="md:hidden z-10 flex flex-col gap-1.25 p-1 cursor-pointer group bg-transparent border-0"
		on:click={() => (menuOpen = !menuOpen)}
		aria-label="Toggle menu"
		aria-expanded={menuOpen}
	>
		<span class="hamburger-line" class:open-1={menuOpen}></span>
		<span class="hamburger-line" class:open-2={menuOpen}></span>
		<span class="hamburger-line" class:open-3={menuOpen}></span>
	</button>
</nav>

<!-- Mobile Menu Panel -->
<div class="mobile-menu md:hidden fixed top-0 right-0 h-screen w-72 z-35 flex flex-col pt-24 pb-12 px-8" class:menu-open={menuOpen}>
	<div class="mb-10 flex items-center gap-3">
		<span style="color: #B4FF00; font-size: 1.1rem; text-shadow: 0 0 10px rgba(180,255,0,0.6);">✦</span>
		<div class="h-px flex-1" style="background: linear-gradient(to right, rgba(180,255,0,0.4), transparent);"></div>
	</div>

	<nav class="flex flex-col gap-1">
		<!-- Home link di mobile -->
		<button
			on:click={() => { menuOpen = false; window.scrollTo({ top: 0, behavior: 'smooth' }); }}
			class="mobile-nav-link group flex items-center gap-4 py-4 text-lg tracking-widest uppercase font-light transition-all duration-300 bg-transparent border-0 text-left w-full cursor-pointer"
			class:active={isAtHero}
		>
			<span class="text-xs" style="color: #B4FF00; opacity: 0.4;">00</span>
			<span>Home</span>
			{#if isAtHero}
				<span class="ml-auto text-[#B4FF00] text-xs">✦</span>
			{/if}
		</button>

		{#each navLinks as link, i}
			<a
				href={link.href}
				on:click={(e) => smoothScroll(e, link.href)}
				class="mobile-nav-link group flex items-center gap-4 py-4 text-lg tracking-widest uppercase font-light transition-all duration-300"
				class:active={activeSection === link.href.replace('#', '')}
				style="transition-delay: {menuOpen ? i * 60 : 0}ms"
			>
				<span class="text-xs" style="color: #B4FF00; opacity: 0.4;">0{i + 1}</span>
				<span>{link.label}</span>
			</a>
		{/each}
	</nav>

	<div class="mt-auto">
		<div class="h-px w-full mb-6" style="background: linear-gradient(to right, rgba(180,255,0,0.15), transparent);"></div>
		<p class="text-[10px] tracking-widest text-[#4B5563] uppercase">Portofolio · 2025</p>
	</div>
</div>

<style>
	nav {
		--neon: #B4FF00;
	}

	nav.scrolled {
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		background: rgba(5, 5, 5, 0.607);
		border-bottom: 1px solid rgba(180, 255, 0, 0.07);
		box-shadow: 0 4px 40px rgba(0, 0, 0, 0.4);
	}

	/* ── Hero section indicator animations ── */
	@keyframes hero-ping {
		0%   { transform: scale(0.8); opacity: 0.8; }
		70%  { transform: scale(1.4); opacity: 0;   }
		100% { transform: scale(1.4); opacity: 0;   }
	}

	@keyframes fade-in {
		from { opacity: 0; transform: translateY(-4px); }
		to   { opacity: 1; transform: translateY(0);    }
	}

	/* ── Sparkle ── */
	.sparkle-icon {
		animation: sparkle-pulse 4s ease-in-out infinite;
		display: inline-block;
		transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), text-shadow 0.5s;
	}

	@keyframes sparkle-pulse {
		0%, 100% { transform: scale(1) rotate(0deg); }
		50%       { transform: scale(1.08) rotate(5deg); }
	}

	.orbit-ring {
		animation: orbit-spin 8s linear infinite;
	}
	.orbit-ring-reverse {
		animation: orbit-spin 14s linear infinite reverse;
	}
	@keyframes orbit-spin {
		from { transform: rotate(0deg); }
		to   { transform: rotate(360deg); }
	}

	/* ── Desktop Nav links ── */
	.nav-link {
		position: relative;
		color: #6B7280;
		letter-spacing: 0.12em;
	}

	.nav-link:hover,
	.nav-link.active {
		color: #B4FF00;
	}

	.nav-link.active {
		text-shadow: 0 0 8px rgba(180, 255, 0, 0.4);
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -3px;
		left: 0;
		width: 0;
		height: 1px;
		background: #B4FF00;
		box-shadow: 0 0 6px rgba(180, 255, 0, 0.8);
		transition: width 0.35s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.nav-link:hover::after,
	.nav-link.active::after {
		width: 100%;
	}

	/* ── Hamburger ── */
	.hamburger-line {
		display: block;
		width: 22px;
		height: 1.5px;
		background: #6B7280;
		border-radius: 2px;
		transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
		transform-origin: center;
	}

	button:hover .hamburger-line {
		background: #B4FF00;
	}

	.open-1 { transform: translateY(6.5px) rotate(45deg);  background: #B4FF00 !important; box-shadow: 0 0 6px rgba(180,255,0,0.6); }
	.open-2 { opacity: 0; transform: scaleX(0); }
	.open-3 { transform: translateY(-6.5px) rotate(-45deg); background: #B4FF00 !important; box-shadow: 0 0 6px rgba(180,255,0,0.6); }

	/* ── Mobile Menu ── */
	.mobile-menu {
		background: rgba(6, 6, 6, 0.97);
		backdrop-filter: blur(30px);
		-webkit-backdrop-filter: blur(30px);
		border-left: 1px solid rgba(180, 255, 0, 0.06);
		transform: translateX(100%);
		transition: transform 0.45s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: -20px 0 60px rgba(0,0,0,0.6);
	}

	.mobile-menu.menu-open {
		transform: translateX(0);
	}

	.mobile-nav-link {
		color: #4B5563;
		border-bottom: 1px solid rgba(255,255,255,0.04);
	}

	.mobile-nav-link:hover,
	.mobile-nav-link.active {
		color: #B4FF00;
		text-shadow: 0 0 12px rgba(180,255,0,0.3);
		padding-left: 0.5rem;
	}
</style>