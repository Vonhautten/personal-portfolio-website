<script lang="ts">
	import { onMount } from 'svelte';
	import { projects } from '$lib/data/siteData';
	import type { PatternType } from '$lib/data/siteData';

	let activeProject: number | null = null;
	let hoveredProject: number | null = null;
	let mousePosition = { x: 0, y: 0 };
	let scanlinePos = 0;
	let glitchIntensity = 0;

	let inView: boolean[] = projects.map(() => false);

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const idx = Number((entry.target as HTMLElement).dataset.index);
						inView[idx] = true;
						inView = [...inView];
						
						setTimeout(() => {
							glitchIntensity = 0.3;
							setTimeout(() => glitchIntensity = 0, 200);
						}, idx * 200);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
		);

		document.querySelectorAll('[data-project-row]').forEach((el) => observer.observe(el));

		const handleMouseMove = (e: MouseEvent) => {
			mousePosition = { x: e.clientX, y: e.clientY };
			scanlinePos = (e.clientY / window.innerHeight) * 100;
		};
		window.addEventListener('mousemove', handleMouseMove);

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'g' && e.ctrlKey) {
				glitchIntensity = 1;
				setTimeout(() => glitchIntensity = 0, 500);
			}
		};
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			observer.disconnect();
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('keydown', handleKeyDown);
		};
	});

	const getPatternStyle = (pattern: PatternType, color: string) => {
		const patterns: Record<PatternType, string> = {
			circuit:  `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 10 L40 10 L40 30 L20 30 Z' stroke='${color.replace('#', '%23')}22' fill='none' stroke-width='1'/%3E%3Ccircle cx='30' cy='20' r='2' fill='${color.replace('#', '%23')}22'/%3E%3C/svg%3E")`,
			dots:     `radial-gradient(circle at 20px 20px, ${color}22 2px, transparent 2px), radial-gradient(circle at 40px 40px, ${color}22 2px, transparent 2px)`,
			waves:    `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q 25 0, 50 10 T 100 10' stroke='${color.replace('#', '%23')}22' fill='none' stroke-width='1.5'/%3E%3C/svg%3E")`,
			grid:     `linear-gradient(${color}22 1px, transparent 1px), linear-gradient(90deg, ${color}22 1px, transparent 1px)`,
			hexagon:  `url("data:image/svg+xml,%3Csvg width='56' height='64' viewBox='0 0 56 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z' stroke='${color.replace('#', '%23')}22' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
			cross:    `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='0' y1='10' x2='20' y2='10' stroke='${color.replace('#', '%23')}22' stroke-width='1'/%3E%3Cline x1='10' y1='0' x2='10' y2='20' stroke='${color.replace('#', '%23')}22' stroke-width='1'/%3E%3C/svg%3E")`,
		};
		return patterns[pattern] ?? patterns.dots;
	};
</script>

<svelte:head>
	<style>
		@keyframes dataStream {
			0% { transform: translateY(-100%); }
			100% { transform: translateY(1000%); }
		}
		
		@keyframes glitchScan {
			0%, 100% { transform: translateX(0) skewX(0deg); }
			33% { transform: translateX(-2px) skewX(2deg); filter: hue-rotate(45deg); }
			66% { transform: translateX(2px) skewX(-2deg); filter: hue-rotate(-45deg); }
		}
		
		@keyframes hologramFlicker {
			0%, 100% { opacity: 1; text-shadow: 0 0 10px currentColor; }
			50% { opacity: 0.8; text-shadow: 0 0 20px currentColor, 0 0 40px currentColor; }
		}
	</style>
</svelte:head>

<section id="projects" class="relative min-h-screen py-32 px-6 md:px-20 lg:px-32 overflow-hidden">

	<!-- Cyber Grid Background -->
	<div class="absolute inset-0" style="perspective: 800px;">
		<div 
			class="absolute inset-0 opacity-20"
			style="
				background-image: 
					linear-gradient(rgba(180,255,0,0.1) 1px, transparent 1px),
					linear-gradient(90deg, rgba(0,229,255,0.1) 1px, transparent 1px);
				background-size: 40px 40px;
				transform: rotateX(70deg) scale(3) translateY(-20%);
				transform-origin: center top;
				animation: gridPulse 8s infinite;
			"
		></div>
	</div>

	<!-- Data Stream Effect -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden">
		{#each Array(10) as _, i}
			<div 
				class="absolute w-px h-full bg-linear-to-brom-transparent via-[#B4FF00] to-transparent opacity-10"
				style="
					left: {i * 10}%;
					animation: dataStream {8 + i}s linear infinite;
					animation-delay: -{i * 2}s;
				"
			></div>
		{/each}
	</div>

	<!-- Glitch Overlay -->
	<div 
		class="absolute inset-0 pointer-events-none z-50 mix-blend-overlay transition-opacity"
		style="
			opacity: {glitchIntensity};
			background: repeating-linear-gradient(0deg, 
				rgba(180,255,0,0.3) 0px, 
				rgba(255,0,255,0.3) 1px, 
				transparent 2px,
				transparent 4px
			);
			animation: glitchScan 0.2s infinite;
		"
	></div>

	<!-- Corner brackets — same style as Hero -->
	<div class="absolute top-8 left-6 md:left-16 w-8 h-8 border-t-2 border-l-2 border-[#B4FF00]/30 pointer-events-none"></div>
	<div class="absolute top-8 right-6 md:right-16 w-8 h-8 border-t-2 border-r-2 border-[#B4FF00]/30 pointer-events-none"></div>
	<div class="absolute bottom-8 left-6 md:left-16 w-8 h-8 border-b-2 border-l-2 border-[#00E5FF]/20 pointer-events-none"></div>
	<div class="absolute bottom-8 right-6 md:right-16 w-8 h-8 border-b-2 border-r-2 border-[#00E5FF]/20 pointer-events-none"></div>

	<!-- Holographic Section Header -->
	<div class="relative mb-24 md:mb-32">
		<!-- 3D Floating Background Text -->
		<div class="absolute -top-20 -right-10 text-[15vw] font-black text-[#F5F5F5]/3 select-none uppercase"
			style="
				transform: translateZ(-50px) rotateX(10deg);
				text-shadow: 2px 2px 0 #B4FF00, -2px -2px 0 #00E5FF;
				animation: hologramFlicker 3s infinite;
			">
			WORKS
		</div>

		<div class="flex items-end justify-between relative z-10">
			<div class="relative">
				<div class="absolute -left-20 top-0 w-px h-20 bg-linear-to-b from-transparent via-[#B4FF00] to-transparent animate-pulse"></div>
				
				<div class="flex items-center gap-3 mb-6 group">
					<div class="w-12 h-px bg-[#B4FF00] relative overflow-hidden">
						<div class="absolute inset-0 bg-[#B4FF00] animate-pulse" style="filter: blur(4px);"></div>
					</div>
					<span class="font-mono text-[11px] text-[#B4FF00] tracking-[0.4em] uppercase relative">
						<span class="relative">
							[ACCESSING DATABASE]
							<span class="absolute -bottom-4 left-0 text-[8px] text-[#00E5FF]/50 whitespace-nowrap">
								> DECRYPTING...
							</span>
						</span>
					</span>
				</div>
				
				<h2 class="relative group">
					<span class="block text-[clamp(3rem,8vw,6rem)] font-black text-[#F5F5F5] leading-[0.9] tracking-tight relative"
						style="text-shadow: 3px 3px 0 rgba(180,255,0,0.2), -1px -1px 0 rgba(0,229,255,0.2);">
						<span class="relative">
							FEATURED
							<span class="absolute -inset-2 border border-[#B4FF00]/20 rounded-lg blur-sm opacity-0 group-hover:opacity-100 transition-opacity"></span>
						</span>
					</span>
					<span class="block text-[clamp(3rem,8vw,6rem)] font-black text-[#B4FF00] leading-[0.9] tracking-tight mt-2 relative">
						PROJECTS
					</span>
				</h2>

				<div class="mt-4 font-mono text-[8px] text-[#9CA3AF]/20 tracking-[0.5em]">
					0x7F3A • 9B2C • 4D8E • 1F5A
				</div>
			</div>

			<!-- Cyber Dashboard Stats -->
			<div class="hidden md:flex flex-col items-end gap-2 p-4 border border-[#B4FF00]/20 bg-black/50 backdrop-blur"
				style="clip-path: polygon(0 0, 100% 0, 100% 90%, 90% 100%, 0 100%);">
				<div class="flex items-center gap-3">
					<span class="font-mono text-2xl font-bold text-[#B4FF00] counter" data-target={projects.length}>9</span>
					<span class="font-mono text-[11px] text-[#9CA3AF]/60 tracking-widest">ACTIVE WORKS</span>
				</div>
				<div class="flex items-center gap-3">
					<span class="font-mono text-sm text-[#00E5FF]">{Math.min(...projects.map(p => Number(p.year)))}</span>
					<span class="text-[#9CA3AF]/40">→</span>
					<span class="font-mono text-sm text-[#B4FF00]">{Math.max(...projects.map(p => Number(p.year)))}</span>
					<span class="font-mono text-[8px] text-[#d0d4db]/30">TIMELINE</span>
				</div>
				<div class="w-full h-px bg-linear-to-r from-transparent via-[#B4FF00]/30 to-transparent my-2"></div>
				<div class="font-mono text-[8px] text-[#00E5FF]/50 flex items-center gap-2">
					✦ ✦ ✦ &nbsp; END OF LINE &nbsp; ✦ ✦ ✦
				</div>
			</div>
		</div>
	</div>

	<!-- Project Vault -->
	<div class="relative max-w-7xl mx-auto">

		<!-- Central Data Core -->
		<div class="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden lg:block">
			<div class="absolute inset-0 bg-linear-to-b from-transparent via-[#B4FF00] to-transparent opacity-30"
				style="animation: pulseCore 3s infinite;"></div>
			<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#B4FF00] rounded-full blur-md animate-ping"></div>
		</div>

		{#each projects as project, i}
			<!-- svelte-ignore a11y-no-static-element-interactions -->
			<div
				data-project-row
				data-index={i}
				class="group relative mb-8 last:mb-0 perspective-2000"
				style="
					opacity: {inView[i] ? 1 : 0};
					transform: {inView[i] ? 'translateY(0) rotateX(0)' : 'translateY(60px) rotateX(-5deg)'};
					transition: all 0.8s cubic-bezier(0.2, 0.9, 0.3, 1);
					transition-delay: {i * 120}ms;
					transform-style: preserve-3d;
				"
				on:mouseenter={() => { activeProject = i; hoveredProject = i; }}
				on:mouseleave={() => { activeProject = null; hoveredProject = null; }}
			>
				<!-- 3D Holographic Container -->
				<div class="relative transform-gpu transition-transform duration-700 group-hover:translate-z-20"
					style="transform-style: preserve-3d;">
					
					<div class="relative">
						
						<div class="absolute -inset-0.5 bg-linear-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md"
							style="background: {project.gradient};"></div>
						
						<div class="relative overflow-hidden border border-white/10 bg-black/80 backdrop-blur-sm"
							style="
								clip-path: polygon(2% 0%, 100% 0%, 100% 98%, 98% 100%, 0% 100%, 0% 2%);
								box-shadow: 0 20px 40px rgba(0,0,0,0.8);
							">
			
							<!-- Circuit Pattern Overlay -->
							<div
								class="absolute inset-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700"
								style="
									background-image: {getPatternStyle(project.pattern, project.color)};
									background-size: 40px 40px;
									animation: circuitFlow 20s linear infinite;
								"
							></div>

							<!-- Data Particles -->
							<div class="absolute inset-0 overflow-hidden pointer-events-none">
								{#each Array(10) as _, j}
									<div 
										class="absolute w-0.5 h-0.5 bg-white rounded-full"
										style="
											left: {Math.random() * 100}%;
											top: {Math.random() * 100}%;
											background: {project.color};
											opacity: {activeProject === i ? 0.5 : 0.1};
											animation: particleFloat {3 + Math.random() * 5}s infinite;
											animation-delay: -{Math.random() * 5}s;
										"
									></div>
								{/each}
							</div>

							<!-- Content Grid -->
							<div class="p-8 md:p-12 flex flex-col lg:flex-row gap-10 items-center relative z-10">

								<!-- LEFT: Project ID Card -->
								<div class="z-10 w-full lg:w-1/3 relative">
									<div class="relative mb-6 inline-block"
										style="transform: translateZ(10px);">
										<div class="absolute inset-0 bg-[#B4FF00]/20 blur-xl rounded-full"
											style="animation: pulseGlow 2s infinite;"></div>
										<div class="relative font-mono text-6xl font-black"
											style="color: {project.color}; text-shadow: 0 0 30px {project.color};">
											{project.id}
										</div>
									</div>

									<div class="relative space-y-4">
										<div class="flex items-center gap-3">
											<span
												class="font-mono text-xs px-4 py-2 border relative overflow-hidden group/year"
												style="border-color: {project.color}40; background: {project.color}10; color: {project.color};">
												<span class="relative z-10">{project.year}</span>
												<span class="absolute inset-0 bg-linear-to-r from-transparent via-white to-transparent opacity-0 group-hover/year:opacity-20 group-hover/year:animate-shimmer"></span>
											</span>
											<span class="font-mono text-[8px] text-[#00E5FF]/40">TIMESTAMP</span>
										</div>

										<h3 class="text-4xl font-black text-white mb-2 relative">
											<span class="relative">
												{project.name}
												<span class="absolute -bottom-1 left-0 w-0 group-hover:w-full h-0.5 bg-[#B4FF00] transition-all duration-700"></span>
											</span>
										</h3>

										<p class="font-mono text-xs uppercase tracking-[0.2em] flex items-center gap-2"
											style="color: {project.color}">
											<span class="w-2 h-2 rounded-full bg-[#B4FF00] animate-pulse"></span>
											{project.tagline}
										</p>

										<div class="flex flex-wrap gap-2 mt-4">
											{#each project.tech.slice(0, 4) as tag}
												<span
													class="font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 border relative overflow-hidden group/tech"
													style="color: {project.color}; border-color: {project.color}30; background: {project.color}08;">
													<span class="relative z-10">{tag}</span>
													<span class="absolute inset-0 bg-linear-to-r from-transparent via-{project.color} to-transparent opacity-0 group-hover/tech:opacity-20 group-hover/tech:animate-shimmer"></span>
												</span>
											{/each}
											{#if project.tech.length > 4}
												<span class="font-mono text-[9px] px-3 py-1.5 border border-dashed"
													style="border-color: {project.color}40; color: {project.color}80;">
													+{project.tech.length - 4}
												</span>
											{/if}
										</div>
									</div>
								</div>

								<!-- CENTER: Holographic Preview -->
								<div class="relative w-full lg:w-1/3 aspect-square group/thumb">
									<div class="absolute inset-0"
										style="transform-style: preserve-3d; animation: float3D 6s ease-in-out infinite;">
										
										<div class="absolute inset-0 rounded-2xl border-2 border-white/20 bg-black/40 overflow-hidden"
											style="
												clip-path: polygon(8% 0, 100% 0, 100% 92%, 92% 100%, 0 100%, 0 8%);
												transform: translateZ(10px);
											">
											
											<div
												class="absolute inset-0 opacity-30 group-hover/thumb:opacity-60 transition-opacity"
												style="
													background-image: {getPatternStyle(project.pattern, project.color)};
													background-size: 30px 30px;
													animation: patternShift 10s linear infinite;
												"
											></div>
												{#if project.thumbnail}
													<img
														src={project.thumbnail}
														alt={project.name}
														class="absolute inset-0 w-full h-full object-cover z-10 project-thumb"
														style="
															--proj-color-r: {parseInt(project.color.slice(1,3), 16)};
															--proj-color-g: {parseInt(project.color.slice(3,5), 16)};
															--proj-color-b: {parseInt(project.color.slice(5,7), 16)};
														"
													/>
													<div
														class="absolute inset-0 z-20 pointer-events-none mix-blend-color transition-all duration-700 group-hover/thumb:opacity-60"
														style="
															background: linear-gradient(
																135deg,
																{project.color}CC 0%,
																{project.colorSecondary}99 50%,
																#000000AA 100%
															);
															opacity: 0.75;
														"
													></div>
													<div class="absolute inset-0 z-20 pointer-events-none"
														style="background: radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.7) 100%);">
													</div>
												{:else}
												<div class="absolute inset-0 flex items-center justify-center font-black text-9xl"
													style="color: {project.color}; opacity: 0.2;">
													{project.id}
												</div>
											{/if}

											<div class="absolute inset-0 z-20 pointer-events-none">
												<div class="absolute top-0 left-0 w-full h-1 bg-linear-to-b from-{project.color} to-transparent opacity-0 group-hover/thumb:opacity-100 animate-scan"></div>
											</div>
										</div>

										<div class="absolute -inset-4 border border-{project.color}/20 rounded-full opacity-0 group-hover/thumb:opacity-100 animate-ping-slow"></div>
										<div class="absolute -inset-8 border border-{project.color}/10 rounded-full opacity-0 group-hover/thumb:opacity-50 animate-ping-slower"></div>
									</div>
								</div>

								<!-- RIGHT: Project Details -->
								<div class="w-full lg:w-1/3 relative">
									<div class="relative p-6 rounded-2xl bg-black/60 border border-white/10 backdrop-blur"
										style="
											transform: translateZ(15px);
											box-shadow: 0 10px 30px -15px {project.color};
										">
										
										<div class="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#B4FF00]/30"></div>
										<div class="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#00E5FF]/30"></div>

										<div class="relative mb-4">
											<span class="absolute -left-2 -top-2 text-4xl opacity-20" style="color: {project.color};">"</span>
											<p class="text-gray-400 text-sm leading-relaxed italic pl-4 relative z-10">
												{project.description}
											</p>
											<span class="absolute -right-2 -bottom-2 text-4xl opacity-20" style="color: {project.color};">"</span>
										</div>

										<div class="flex gap-3 mt-6">
											{#if project.liveUrl}
												<a
													href={project.liveUrl}
													target="_blank"
													rel="noopener noreferrer"
													class="relative group/btn flex-1 font-mono text-[9px] tracking-widest uppercase px-4 py-2.5 border text-center overflow-hidden"
													style="color: {project.color}; border-color: {project.color}40; background: {project.color}10;">
													<span class="relative z-10 flex items-center justify-center gap-2">
														<span>↗</span> DEPLOY
													</span>
													<span class="absolute inset-0 bg-linear-to-r from-transparent via-{project.color} to-transparent opacity-0 group-hover/btn:opacity-30 group-hover/btn:animate-shimmer"></span>
												</a>
											{/if}
											{#if project.repoUrl}
												<a
													href={project.repoUrl}
													target="_blank"
													rel="noopener noreferrer"
													class="group/btn flex-1 font-mono text-[9px] tracking-widest uppercase px-4 py-2.5 border border-white/10 text-[#9CA3AF]/50 hover:text-white hover:border-white/30 transition-all text-center relative overflow-hidden">
													<span class="relative z-10 flex items-center justify-center gap-2">
														<span>&lt;/&gt;</span> SOURCE
													</span>
												</a>
											{/if}
										</div>

										<div class="mt-4 pt-4 border-t border-white/5">
											<div class="flex justify-between text-[8px] font-mono text-[#9CA3AF]/30 mb-1">
												<span>DATA STREAM</span>
												<span>ACTIVE</span>
											</div>
											<div class="h-1 bg-white/5 relative overflow-hidden">
												<div class="absolute inset-0 bg-linear-to-r from-{project.color} to-{project.colorSecondary} animate-dataFlow"></div>
											</div>
										</div>
									</div>

									<div class="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-4 hidden lg:block">
										<div class="relative">
											<span class="text-4xl font-light" style="color: {project.color};">→</span>
											<span class="absolute inset-0 blur-md" style="color: {project.color};">→</span>
										</div>
									</div>
								</div>
							</div>

							<div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-px bg-linear-to-r from-transparent via-{project.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

</section>

<style>
	@keyframes slide {
		from { background-position: 0 0; }
		to { background-position: 60px 60px; }
	}

	@keyframes circuitFlow {
		0% { background-position: 0 0; }
		100% { background-position: 120px 120px; }
	}

	@keyframes patternShift {
		0% { background-position: 0 0; filter: hue-rotate(0deg); }
		50% { filter: hue-rotate(10deg); }
		100% { background-position: 60px 60px; filter: hue-rotate(0deg); }
	}

	@keyframes particleFloat {
		0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.1; }
		50% { transform: translate(20px, -20px) scale(1.5); opacity: 0.5; }
	}

	@keyframes pulseCore {
		0%, 100% { opacity: 0.3; transform: scaleY(1); }
		50% { opacity: 0.8; transform: scaleY(1.5); }
	}

	@keyframes scan {
		0% { top: -10%; }
		100% { top: 110%; }
	}

	@keyframes dataFlow {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(200%); }
	}

	@keyframes float3D {
		0%, 100% { transform: translateY(0) rotateX(0deg); }
		50% { transform: translateY(-10px) rotateX(2deg); }
	}

	@keyframes shimmer {
		0% { transform: translateX(-100%); }
		100% { transform: translateX(100%); }
	}

	.perspective-1000 { perspective: 1000px; }
	.perspective-2000 { perspective: 2000px; }

	.group:hover .group-hover\:translate-z-20 {
		transform: translateZ(20px);
	}

	.animate-spin-slow { animation: spin 8s linear infinite; }
	.animate-spin-slow-reverse { animation: spin 12s linear infinite reverse; }
	.animate-ping-slow { animation: ping 3s cubic-bezier(0, 0, 0.2, 1) infinite; }
	.animate-ping-slower { animation: ping 4s cubic-bezier(0, 0, 0.2, 1) infinite; }
	.animate-shimmer { animation: shimmer 2s infinite; }
	.animate-scan { animation: scan 3s linear infinite; }
	.animate-dataFlow { animation: dataFlow 3s linear infinite; }

	@keyframes ping {
		75%, 100% { transform: scale(2); opacity: 0; }
	}

	@keyframes spin {
		from { transform: rotateX(60deg) rotateZ(0deg); }
		to { transform: rotateX(60deg) rotateZ(360deg); }
	}

	.counter {
		animation: count 2s ease-out forwards;
		counter-reset: count var(--count);
	}

	@keyframes count {
		from { --count: 0; }
		to { --count: v-bind('projects.length'); }
	}

	@media (prefers-reduced-motion: reduce) {
		* {
			animation-duration: 0.01ms !important;
			animation-iteration-count: 1 !important;
			transition-duration: 0.01ms !important;
		}
	}

	.project-thumb {
		filter: grayscale(80%) contrast(120%) brightness(0.7);
		transition: filter 0.7s ease;
	}

	.group\/thumb:hover .project-thumb {
		filter: grayscale(20%) contrast(110%) brightness(0.9) saturate(1.3);
	}
</style>