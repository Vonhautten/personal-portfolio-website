<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import ThreeBackground from '$lib/components/ThreeBackground.svelte';
	import Profile from '$lib/components/page/Profile.svelte';
	import Preloader from '$lib/components/Preloader.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Hero from '$lib/components/page/Hero.svelte';
	import Projects from '$lib/components/page/Projects.svelte';
	import Contact from '$lib/components/page/Contact.svelte';
	import CustomCursor from '$lib/components/CustomCursor.svelte';

	let showContent = $state(false);
	let preloaderDone = $state(false);
	let isScrolled = $state(false);

	onMount(() => {
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	});

	function handlePreloaderDone(): void {
		preloaderDone = true;
		// Beri waktu ThreeBackground fully visible dulu, baru munculkan hero
		setTimeout(() => {
			showContent = true;
		}, 300);
	}

	function handleScroll(): void {
		isScrolled = window.scrollY > 100;
	}

	function scrollToSection(sectionId: string): void {
		const element = document.getElementById(sectionId);
		if (element) element.scrollIntoView({ behavior: 'smooth' });
	}
</script>

<CustomCursor />

<!-- 
	ThreeBackground selalu ada di DOM sejak awal,
	tapi opacity-nya 0 → naik ke 1 setelah preloader selesai.
	Ini mencegah "pop-in" background setelah preloader.
-->
<div
	class="fixed inset-0 -z-10 transition-opacity duration-700"
	class:opacity-0={!preloaderDone}
	class:opacity-100={preloaderDone}
	aria-hidden="true"
>
	<ThreeBackground />
</div>

<!-- Noise Texture Overlay -->
<div
	class="fixed inset-0 pointer-events-none opacity-20 mix-blend-overlay"
	style="
		z-index: -5;
		background-image: url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.2\'/%3E%3C/svg%3E');
		background-repeat: repeat;
	"
></div>

<!-- Preloader: selalu ada di atas segalanya, lalu fade out lewat animasinya sendiri -->
{#if !preloaderDone}
	<Preloader ondone={handlePreloaderDone} />
{/if}

<!-- Konten utama: muncul setelah background sudah fully visible -->
{#if showContent}
	<div in:fade={{ duration: 600, easing: cubicOut }} class="relative">
		<Navbar />



		<main class="relative">
			<!-- Hero Section -->
			<section id="home" class="relative min-h-screen">
				<Hero />
				<div class="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
					<button
						onclick={() => scrollToSection('profile')}
						class="group flex flex-col items-center gap-2 cursor-pointer"
						aria-label="Scroll to profile section"
					>
						<span class="text-xs font-mono text-[#9CA3AF]/40 tracking-widest group-hover:text-[#B4FF00] transition-colors">
							SCROLL
						</span>
						<div class="w-px h-16 bg-linear-to-b from-[#B4FF00] to-transparent animate-scroll"></div>
					</button>
				</div>
			</section>

			<!-- Profile Section -->
			<section id="profile" class="relative py-20">
				<Profile />
			</section>

			<!-- Projects Section -->
			<section id="projects" class="relative py-20">
				<Projects />
			</section>

			<!-- Contact Section -->
			<section id="contact" class="relative py-20">
				<Contact />
			</section>

			<!-- Contact / Footer Section -->
			<section id="contact" class="relative py-10 bg-[#050505]/80 backdrop-blur-sm border-t border-[#F5F5F5]/5">
				<div class="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
						<div class="space-y-4">
							<h4 class="font-mono text-xs text-[#B4FF00] tracking-[0.3em]">NAVIGATION</h4>
							<ul class="space-y-2">
								<li>
									<button onclick={() => scrollToSection('home')} class="text-[#9CA3AF] hover:text-[#B4FF00] transition-colors bg-transparent border-none p-0 cursor-pointer">
										Home
									</button>
								</li>
								<li>
									<button onclick={() => scrollToSection('profile')} class="text-[#9CA3AF] hover:text-[#00E5FF] transition-colors bg-transparent border-none p-0 cursor-pointer">
										Profile
									</button>
								</li>
								<li>
									<button onclick={() => scrollToSection('projects')} class="text-[#9CA3AF] hover:text-[#8FFF00] transition-colors bg-transparent border-none p-0 cursor-pointer">
										Projects
									</button>
								</li>
							</ul>
						</div>

						<div class="space-y-4">
							<h4 class="font-mono text-xs text-[#00E5FF] tracking-[0.3em]">CONTACT</h4>
							<ul class="space-y-2">
								<li class="text-[#9CA3AF]">zufarrasyid11@gmail.com</li>
								<li class="text-[#9CA3AF]">0814-6380-8146</li>
								<li class="text-[#9CA3AF]">Cimahi, Indonesia</li>
							</ul>
						</div>

						<div class="space-y-4">
							<h4 class="font-mono text-xs text-[#8FFF00] tracking-[0.3em]">SOCIAL</h4>
							<ul class="space-y-2">
								<li>
									<a href="https://github.com/Vonhautten" target="_blank" rel="noopener noreferrer" class="text-[#9CA3AF] hover:text-[#B4FF00] transition-colors">
										GitHub
									</a>
								</li>
								<li>
									<a href="https://linkedin.com/in/zufar-rasyid" target="_blank" rel="noopener noreferrer" class="text-[#9CA3AF] hover:text-[#00E5FF] transition-colors">
										LinkedIn
									</a>
								</li>
								<li>
									<a href="https://instagram.com/zufarrasyid" target="_blank" rel="noopener noreferrer" class="text-[#9CA3AF] hover:text-[#8FFF00] transition-colors">
										Instagram
									</a>
								</li>
							</ul>
						</div>

						<div class="space-y-4">
							<h4 class="font-mono text-xs text-[#FF6B6B] tracking-[0.3em]">AVAILABILITY</h4>
							<p class="text-[#9CA3AF] text-sm">Open for opportunities and collaborations. Let's create something amazing together.</p>
							<div class="flex items-center gap-2">
								<span class="relative flex h-2 w-2">
									<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B4FF00] opacity-75"></span>
									<span class="relative inline-flex rounded-full h-2 w-2 bg-[#B4FF00]"></span>
								</span>
								<span class="text-xs font-mono text-[#B4FF00]">AVAILABLE FOR WORK</span>
							</div>
						</div>
					</div>

					<div class="border-t border-[#F5F5F5]/5 pt-8 mt-8">
						<div class="flex flex-col md:flex-row justify-between items-center gap-4">
							<div class="text-xs font-mono text-[#9CA3AF]/40">
								© 2026 MUHAMMAD ZUFAR RASYID IBRAHIM
							</div>
							<div class="flex gap-6 text-xs font-mono text-[#9CA3AF]/40">
								<span>SOFTWARE ENGINEERING STUDENT</span>
								<span>✦</span>
								<span>SMKN 1 CIMAHI</span>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>

		{#if isScrolled}
			<button
				onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
				class="fixed bottom-8 right-8 w-12 h-12 bg-[#B4FF00]/10 border border-[#B4FF00]/30 rounded-full flex items-center justify-center group hover:bg-[#B4FF00]/20 transition-all duration-300 z-50 backdrop-blur-sm"
				aria-label="Back to top"
			>
				<span class="text-[#B4FF00] group-hover:-translate-y-0.5 transition-transform">↑</span>
			</button>
		{/if}
	</div>
{/if}

<style>
	@keyframes scroll {
		0% { height: 0; opacity: 0; }
		50% { height: 64px; opacity: 1; }
		100% { height: 0; opacity: 0; }
	}

	.animate-scroll { animation: scroll 2s ease infinite; }

	:global(html) { scroll-behavior: smooth; }

	:global(::selection) {
		background: #B4FF00;
		color: #050505;
	}

	:global(::-webkit-scrollbar) { width: 8px; }
	:global(::-webkit-scrollbar-track) { background: #0A0A0A; }
	:global(::-webkit-scrollbar-thumb) { background: #B4FF00; border-radius: 4px; }
	:global(::-webkit-scrollbar-thumb:hover) { background: #00E5FF; }
</style>