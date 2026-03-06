<script context="module" lang="ts">
	/** Memecah teks bio menjadi segmen biasa & highlight */
	function splitBioText(text: string, highlights: { word: string; color: string }[]) {
		type Segment = { text: string; highlight: boolean; color: string };
		let segments: Segment[] = [{ text, highlight: false, color: '' }];

		for (const h of highlights) {
			const next: Segment[] = [];
			for (const seg of segments) {
				if (seg.highlight) { next.push(seg); continue; }
				const parts = seg.text.split(h.word);
				parts.forEach((part, idx) => {
					if (part) next.push({ text: part, highlight: false, color: '' });
					if (idx < parts.length - 1) next.push({ text: h.word, highlight: true, color: h.color });
				});
			}
			segments = next;
		}
		return segments;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { profile } from '$lib/data/siteData';

	let mousePosition = { x: 0, y: 0 };
	let activeStat: number | null = null;
	let sectionEl: HTMLElement;
	let inView = false;

	onMount(() => {
		const observer = new IntersectionObserver(
			([entry]) => { if (entry.isIntersecting) inView = true; },
			{ threshold: 0.1 }
		);
		if (sectionEl) observer.observe(sectionEl);

		const handleMouseMove = (e: MouseEvent) => {
			mousePosition = { x: e.clientX, y: e.clientY };
		};
		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			observer.disconnect();
			window.removeEventListener('mousemove', handleMouseMove);
		};
	});
</script>

<section
	bind:this={sectionEl}
	id="profile"
	class="relative min-h-screen py-32 px-6 md:px-20 lg:px-32 overflow-hidden"
>

	<!-- Large watermark -->
	<div class="absolute -right-8 top-1/3 text-[18vw] font-black text-[#F5F5F5]/3 select-none pointer-events-none leading-none tracking-tighter rotate-90 origin-right">
		{profile.name.split(' ')[1]}
	</div>

	<!-- Corner brackets -->
	<div class="absolute top-12 left-6 md:left-20 w-8 h-8 border-t-2 border-l-2 border-[#B4FF00]/30"></div>
	<div class="absolute top-12 right-6 md:right-20 w-8 h-8 border-t-2 border-r-2 border-[#B4FF00]/30"></div>
	<div class="absolute bottom-12 left-6 md:left-20 w-8 h-8 border-b-2 border-l-2 border-[#00E5FF]/30"></div>
	<div class="absolute bottom-12 right-6 md:right-20 w-8 h-8 border-b-2 border-r-2 border-[#00E5FF]/30"></div>

	<div class="relative max-w-7xl mx-auto w-full">

		<!-- ── SECTION HEADER ── -->
		<div
			class="flex items-center gap-4 mb-20 transition-all duration-700"
			style="opacity: {inView ? 1 : 0}; transform: {inView ? 'translateY(0)' : 'translateY(30px)'};"
		>
			<div class="w-12 h-px bg-[#B4FF00]"></div>
			<span class="font-mono text-[11px] text-[#B4FF00] tracking-[0.4em] uppercase">Introduction</span>
			<div class="flex-1 h-px bg-[#F5F5F5]/5"></div>
			<span class="font-mono text-[10px] text-[#9CA3AF]/30 tracking-widest">§ 01</span>
		</div>

		<!-- ── MAIN GRID: Photo | Info ── -->
		<div class="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-16 xl:gap-24 items-start">

			<!-- ──── LEFT: Photo Column ──── -->
			<div
				class="transition-all duration-1000 delay-200"
				style="opacity: {inView ? 1 : 0}; transform: {inView ? 'translateX(0)' : 'translateX(-40px)'};"
			>
				<!-- Photo frame with 3D tilt -->
				<div class="relative group">

					<!-- Outer glow ring -->
					<div class="absolute -inset-3 rounded-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-700"
						style="background: radial-gradient(ellipse at center, #B4FF0022, transparent 70%);">
					</div>

					<!-- Main photo container -->
					<div
						class="relative overflow-hidden border border-[#F5F5F5]/10 bg-[#0A0A0A]"
						style="
							clip-path: polygon(0 0, 92% 0, 100% 8%, 100% 100%, 8% 100%, 0 92%);
							transform: perspective(800px) rotateX({(mousePosition.y - 400) / 100}deg) rotateY({(mousePosition.x - 200) / 100}deg);
							transition: transform 0.15s ease;
						"
					>
						<!-- Grid pattern bg -->
						<div class="absolute inset-0 opacity-[0.07]"
							style="background-image: linear-gradient(#B4FF00 1px, transparent 1px), linear-gradient(90deg, #B4FF00 1px, transparent 1px); background-size: 28px 28px;">
						</div>

						<!-- Photo slot (aspect 3:4) -->
						<div class="relative" style="aspect-ratio: 3/4;">

							<img
								src={profile.photo}
								alt={profile.name}
								class="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 z-10"
								onerror={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
							/>

							<!-- Placeholder jika foto belum ada -->
							<div class="absolute inset-0 flex flex-col items-center justify-center gap-5 z-0">
								<div class="w-28 h-28 rounded-full border-2 border-dashed border-[#B4FF00]/30 flex items-center justify-center">
									<span class="text-[#B4FF00]/30 text-4xl">✦</span>
								</div>
								<div class="text-center">
									<p class="font-mono text-[10px] text-[#9CA3AF]/40 tracking-widest">FOTO BELUM TERSEDIA</p>
									<p class="font-mono text-[9px] text-[#9CA3AF]/25 tracking-widest mt-1">{profile.photo}</p>
								</div>
							</div>

							<!-- Gradient bottom overlay -->
							<div class="absolute bottom-0 left-0 right-0 h-2/5 z-20"
								style="background: linear-gradient(to top, #050505 0%, transparent 100%);">
							</div>

							<!-- Scanline overlay -->
							<div class="absolute inset-0 z-30 pointer-events-none scanlines"></div>

							<!-- Corner brackets inside photo -->
							<div class="absolute top-3 left-3 w-5 h-5 border-t border-l border-[#B4FF00]/50 z-30"></div>
							<div class="absolute top-3 right-3 w-5 h-5 border-t border-r border-[#B4FF00]/50 z-30"></div>
						</div>

						<!-- Caption bar -->
						<div class="relative z-20 bg-[#080808] px-5 py-4 border-t border-[#F5F5F5]/5">
							<div class="flex items-center justify-between">
								<div>
									<p class="font-mono text-xs text-[#B4FF00] tracking-widest">
										{profile.name.split(' ').map((w: string) => w[0]).join('-')}
									</p>
									<p class="font-mono text-[10px] text-[#9CA3AF]/40 mt-0.5 tracking-wider">
										{profile.school} · {profile.class}
									</p>
								</div>
								<div class="flex items-center gap-2">
									<span class="relative flex h-2 w-2">
										<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B4FF00] opacity-75"></span>
										<span class="relative inline-flex rounded-full h-2 w-2 bg-[#B4FF00]"></span>
									</span>
									<span class="font-mono text-[9px] text-[#B4FF00]/70 tracking-widest">{profile.statusLabel}</span>
								</div>
							</div>
						</div>
					</div>

					<!-- Decorative dot cluster -->
					<div class="absolute -bottom-5 -right-5 grid grid-cols-4 gap-1.5 opacity-25 pointer-events-none">
						{#each Array(16) as _}
							<div class="w-1 h-1 rounded-full bg-[#B4FF00]"></div>
						{/each}
					</div>

					<!-- Vertical label -->
					<div class="absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 hidden xl:block">
						<span class="font-mono text-[9px] text-[#9CA3AF]/20 tracking-[0.5em] uppercase whitespace-nowrap">
							{profile.role.split('&')[0].trim()}
						</span>
					</div>
				</div>

				<!-- Stats grid below photo -->
				<div class="grid grid-cols-2 gap-3 mt-10">
					{#each profile.stats as stat, i}
						<button
							type="button"
							class="relative group/stat cursor-default bg-transparent p-0 border-0 text-left"
							onmouseenter={() => activeStat = i}
							onmouseleave={() => activeStat = null}
						>
							<div class="absolute inset-0 opacity-0 group-hover/stat:opacity-15 transition-opacity duration-500 rounded-lg"
								style="background: {stat.color};">
							</div>
							<div class="relative p-4 border border-[#F5F5F5]/5 bg-[#0A0A0A]/80 rounded-lg text-center transition-all duration-300 group-hover/stat:-translate-y-0.5 group-hover/stat:border-white/10">
								<div class="text-2xl font-black mb-1 transition-all duration-300 group-hover/stat:scale-110" style="color: {stat.color};">
									{stat.value}
								</div>
								<div class="text-[9px] font-mono text-[#9CA3AF]/50 tracking-widest">
									{stat.label}
								</div>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<!-- ──── RIGHT: Info Column ──── -->
			<div
				class="transition-all duration-1000 delay-400"
				style="opacity: {inView ? 1 : 0}; transform: {inView ? 'translateX(0)' : 'translateX(40px)'};"
			>
				<!-- Name block -->
				<div class="mb-10">
					<span class="font-mono text-[10px] text-[#9CA3AF]/40 tracking-[0.5em] block mb-5 uppercase">
						✦ &nbsp; Software Engineering Student
					</span>

					<h1 class="font-black leading-[0.82] tracking-tight mb-7">
						<span class="block text-[#9CA3AF]/50 text-[1.1rem] font-normal font-mono tracking-[0.3em] mb-3 uppercase">Hi, I'm</span>
						<span class="block text-[#F5F5F5]" style="font-size: clamp(2.8rem, 5vw, 5rem);">{profile.name.split(' ')[0]}</span>
						<span class="block text-[#B4FF00]" style="font-size: clamp(3.5rem, 6.5vw, 6.5rem); text-shadow: 0 0 80px rgba(180,255,0,0.35);">{profile.name.split(' ')[1]}</span>
						<span class="block text-[#F5F5F5]" style="font-size: clamp(1.6rem, 3vw, 3rem);">{profile.name.split(' ').slice(2).join(' ')}</span>
					</h1>

					<div class="flex items-center gap-3">
						<div class="h-px w-8 bg-[#00E5FF]/50"></div>
						<p class="text-[#9CA3AF] text-[15px] font-light">
							<span class="text-[#00E5FF] font-mono mr-1">❯</span>{profile.role}
						</p>
					</div>
				</div>

				<!-- Divider ABOUT -->
				<div class="flex items-center gap-4 mb-4">
					<div class="h-px flex-1 bg-linear-to-r from-[#B4FF00]/20 to-transparent"></div>
					<span class="font-mono text-[9px] text-[#9CA3AF]/25 tracking-[0.5em]">ABOUT</span>
					<div class="h-px flex-1 bg-linear-to-l from-[#B4FF00]/20 to-transparent"></div>
				</div>

				<!-- Bio paragraphs -->
				<div class="space-y-4 mb-11">
					{#each profile.bio as para}
						<p class="text-[#F5F5F5] leading-relaxed text-[15px]">
							{#each splitBioText(para.text, para.highlights) as segment}
								{#if segment.highlight}
									<span class="font-semibold border-b pb-px" style="color: {segment.color}; border-color: {segment.color}50;">{segment.text}</span>
								{:else}
									{segment.text}
								{/if}
							{/each}
						</p>
					{/each}
				</div>

				<!-- Divider ACHIEVEMENTS -->
				<div class="flex items-center gap-4 mb-7">
					<div class="h-px flex-1 bg-linear-to-r from-[#00E5FF]/20 to-transparent"></div>
					<span class="font-mono text-[9px] text-[#9CA3AF]/25 tracking-[0.5em]">ACHIEVEMENTS</span>
					<div class="h-px flex-1 bg-linear-to-l from-[#00E5FF]/20 to-transparent"></div>
				</div>

				<!-- Highlights cards -->
				<div class="flex flex-wrap gap-3 mb-11">
					{#each profile.highlights as h}
						<div class="group/hl relative flex-1 min-w-200px flex items-stretch gap-0 overflow-hidden border border-[#F5F5F5]/5 bg-[#0A0A0A]/60 hover:border-[#F5F5F5]/15 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]">
							<div class="w-0.75 shrink-0 transition-all duration-300" style="background: {h.color};"></div>
							<div class="px-5 py-4 flex-1 min-w-0">
								<p class="text-[#F5F5F5] text-[13px] font-medium leading-snug">{h.text}</p>
								<p class="font-mono text-[10px] mt-1.5 tracking-widest" style="color: {h.color}70;">{h.sub}</p>
							</div>
							<div class="flex items-center px-4 opacity-0 group-hover/hl:opacity-100 transition-all duration-300 group-hover/hl:translate-x-0 translate-x-2">
								<span style="color: {h.color};">✦</span>
							</div>
						</div>
					{/each}
				</div>

				<!-- Divider TECH STACK -->
				<div class="flex items-center gap-4 mb-5">
					<div class="h-px flex-1 bg-linear-to-r from-[#8FFF00]/20 to-transparent"></div>
					<span class="font-mono text-[9px] text-[#9CA3AF]/25 tracking-[0.5em]">TECH STACK</span>
					<div class="h-px flex-1 bg-linear-to-l from-[#8FFF00]/20 to-transparent"></div>
				</div>

				<!-- Skills tags -->
				<div class="flex flex-wrap gap-2 mb-12">
					{#each profile.skills as skill, i}
						<span
							class="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border transition-all duration-200 hover:scale-105 hover:-translate-y-0.5"
							style="
								color: {['#B4FF00','#00E5FF','#8FFF00','#FF6B6B'][i % 4]};
								border-color: {['#B4FF00','#00E5FF','#8FFF00','#FF6B6B'][i % 4]}28;
								background: {['#B4FF00','#00E5FF','#8FFF00','#FF6B6B'][i % 4]}06;
							"
						>
							{skill}
						</span>
					{/each}
				</div>

				<!-- CTA Buttons -->
				<div class="flex flex-wrap gap-4">
					<a
						href={profile.cta.projects.href}
						class="group/btn relative px-8 py-4 bg-[#B4FF00] text-[#050505] font-black text-xs tracking-widest uppercase overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(180,255,0,0.45)]"
						style="clip-path: polygon(0 0, 94% 0, 100% 14%, 100% 100%, 6% 100%, 0 86%);"
					>
						<span class="relative z-10">{profile.cta.projects.label}</span>
						<div class="absolute inset-0 bg-white transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
					</a>

					<a
						href={profile.cta.contact.href}
						class="group/btn relative px-8 py-4 border border-[#B4FF00]/25 text-[#F5F5F5] font-black text-xs tracking-widest uppercase transition-all duration-300 hover:border-[#B4FF00] hover:text-[#B4FF00]"
						style="clip-path: polygon(0 0, 94% 0, 100% 14%, 100% 100%, 6% 100%, 0 86%);"
					>
						<span class="relative z-10">{profile.cta.contact.label}</span>
					</a>

				</div>
			</div>
		</div>

	</div>
</section>

<style>
	/* CRT scanlines pada foto */
	.scanlines {
		background: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 3px,
			rgba(0, 0, 0, 0.06) 3px,
			rgba(0, 0, 0, 0.06) 4px
		);
	}

	:global(::selection) {
		background: #B4FF00;
		color: #050505;
	}
</style>