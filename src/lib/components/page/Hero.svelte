<script lang="ts">
	import { onMount } from 'svelte';
	import gsap from 'gsap';
	import { ScrollTrigger } from 'gsap/ScrollTrigger';
	import { hero } from '$lib/data/siteData';

	gsap.registerPlugin(ScrollTrigger);

	let section: HTMLElement;
	let titleLine1: HTMLElement;
	let titleLine2: HTMLElement;
	let subtitleEl: HTMLElement;

	// Typewriter
	let roleIndex = 0;
	let displayedRole = '';
	let isDeleting = false;
	let typeTimeout: ReturnType<typeof setTimeout>;

	function typewriter() {
		const current = hero.roles[roleIndex];
		if (!isDeleting) {
			displayedRole = current.slice(0, displayedRole.length + 1);
			if (displayedRole === current) {
				typeTimeout = setTimeout(() => { isDeleting = true; typewriter(); }, 2200);
				return;
			}
		} else {
			displayedRole = current.slice(0, displayedRole.length - 1);
			if (displayedRole === '') {
				isDeleting = false;
				roleIndex = (roleIndex + 1) % hero.roles.length;
			}
		}
		typeTimeout = setTimeout(typewriter, isDeleting ? 35 : 75);
	}

	onMount(() => {
		const letters1 = titleLine1.querySelectorAll('.letter');
		const letters2 = titleLine2.querySelectorAll('.letter');

		const tl = gsap.timeline({ onComplete: () => typewriter() });

		tl.from(section, { opacity: 0, duration: 0.5, ease: 'power2.out' })
		  .from(letters1, {
				y: 110, opacity: 0,
				stagger: 0.03, duration: 0.9,
				ease: 'power4.out',
		  }, '-=0.2')
		  .from(letters2, {
				y: 110, opacity: 0,
				stagger: 0.05, duration: 1.1,
				ease: 'power4.out',
		  }, '-=0.75')
		  .from(subtitleEl, {
				y: 24, opacity: 0,
				duration: 0.7, ease: 'power3.out',
		  }, '-=0.5')

		// Subtle parallax
		gsap.to(section, {
			scrollTrigger: {
				trigger: section,
				start: 'top top',
				end: 'bottom top',
				scrub: true,
			},
			y: -50,
		});

		return () => clearTimeout(typeTimeout);
	});
</script>

<section
	bind:this={section}
	id="home"
	class="relative min-h-screen flex flex-col justify-center items-center text-center text-white overflow-hidden px-6"
>
	<!-- Ambient centre glow -->
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full pointer-events-none -z-10"
		style="background: radial-gradient(ellipse, rgba(180,255,0,0.07) 0%, transparent 65%);"
	></div>

	<!-- Corner brackets -->
	<div class="absolute top-8 left-6 md:left-16 w-8 h-8 border-t-2 border-l-2 border-[#B4FF00]/30 pointer-events-none"></div>
	<div class="absolute top-8 right-6 md:right-16 w-8 h-8 border-t-2 border-r-2 border-[#B4FF00]/30 pointer-events-none"></div>
	<div class="absolute bottom-8 left-6 md:left-16 w-8 h-8 border-b-2 border-l-2 border-[#00E5FF]/20 pointer-events-none"></div>
	<div class="absolute bottom-8 right-6 md:right-16 w-8 h-8 border-b-2 border-r-2 border-[#00E5FF]/20 pointer-events-none"></div>

	<!-- ── CONTENT ── -->
	<div class="relative z-10 flex flex-col items-center">

		<!-- firstName: MUHAMMAD -->
		<div class="overflow-hidden">
			<h1
				bind:this={titleLine1}
				class="font-black leading-[0.88] tracking-tight select-none"
				style="font-size: clamp(2.8rem, 8.5vw, 7.5rem); color: #F5F5F5;"

			>
				{#each hero.firstName.split('') as char}
					<span class="letter inline-block">{char}</span>
				{/each}
			</h1>
		</div>

		<!-- lastName: ZUFAR -->
		<div class="overflow-hidden relative">
			<h1
				bind:this={titleLine2}
				class="font-black leading-[0.88] tracking-tight select-none"
				style="
					font-size: clamp(4rem, 13.5vw, 12rem);
					color: #B4F000;
					text-shadow: 0 0 60px rgba(180,255,0,0.35), 0 0 120px rgba(180,255,0,0.12);
					letter-spacing: -0.02em;
				"

			>
				{#each hero.lastName.split('') as char}
					<span class="letter inline-block">{char}</span>
				{/each}
			</h1>
			<!-- Underline gradient -->
			<div
				class="absolute -bottom-1 left-0 right-0 h-px"
				style="background: linear-gradient(90deg, transparent, #B4FF00 30%, #00E5FF 70%, transparent);"
			></div>
		</div>

		<!-- fullName: kecil, abu -->
		<p
			class="font-black tracking-[0.25em] mt-1 select-none"
			style="font-size: clamp(0.85rem, 2vw, 1.6rem); color: #6B7280;"
		>
			{hero.fullName}
		</p>

		<!-- ── TYPEWRITER ── -->
		<div bind:this={subtitleEl} class="mt-10 flex items-center gap-2.5">
			<span class="text-[#00E5FF] font-mono text-sm leading-none">❯</span>
			<p class="text-[#9CA3AF] text-base md:text-lg font-light tracking-wide text-left" style="min-width: 240px;">
				{displayedRole}<span class="cursor inline-block w-0.5 h-[1.1em] bg-[#B4FF00] ml-0.5 align-middle"></span>
			</p>
		</div>


	</div>

	<!-- Scroll indicator -->
	<div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
		<span class="font-mono text-[8px] text-[#9CA3AF]/25 tracking-[0.4em]">SCROLL</span>
		<div class="w-px h-14 overflow-hidden relative" style="background: rgba(255,255,255,0.04);">
			<div class="scroll-light absolute inset-x-0 top-0 h-full" style="background: linear-gradient(to bottom, #B4FF00, transparent);"></div>
		</div>
	</div>

</section>

<style>
	.letter {
		transition: color 0.2s, text-shadow 0.2s;
		cursor: default;
	}
	.letter:hover {
		color: #00E5FF;
		text-shadow: 0 0 20px rgba(0,229,255,0.5);
	}

	.cursor {
		animation: blink 0.85s step-end infinite;
	}
	@keyframes blink {
		0%, 100% { opacity: 1; }
		50%       { opacity: 0; }
	}

	.scroll-light {
		animation: scroll-drop 2s ease-in-out infinite;
	}
	@keyframes scroll-drop {
		0%   { transform: translateY(-100%); }
		100% { transform: translateY(200%); }
	}
</style>