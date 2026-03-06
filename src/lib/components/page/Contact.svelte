<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { contact } from '$lib/data/siteData';

	let sectionEl: HTMLElement;
	let inView = false;
	let glitchText = '';
	let scanlinePosition = 0;
	let noiseOpacity = 0;

	// ── TERMINAL STATE ────────────────────────────────────────────────────────
	type Phase = 'boot' | 'menu' | 'input' | 'detail' | 'error';

	let phase: Phase = 'boot';
	let bootLines: string[] = [];
	let inputValue = '';
	let selectedIndex: number | null = null;
	let detailLines: string[] = [];
	let errorMsg = '';
	let inputEl: HTMLInputElement | undefined;
	let outputEl: HTMLDivElement | undefined;

	// bg loops
	let bgFrame: number;

	const BOOT_SEQUENCE = [
		'CONNECT_PROTOCOL v3.1.4',
		'━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
		'> Initializing neural bridge...',
		'> Handshake established [OK]',
		`> ${contact.socials.length} channels detected`,
		'> Encryption layer: ACTIVE',
		'━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
		'SYSTEM READY. TYPE CHANNEL NUMBER.',
	];

	onMount(() => {
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting && !inView) {
					inView = true;
					startGlitch();
					runBoot();
				}
			},
			{ threshold: 0.15 }
		);
		if (sectionEl) io.observe(sectionEl);

		// background FX
		const animBg = () => {
			scanlinePosition = (scanlinePosition + 0.35) % 100;
			noiseOpacity = Math.random() * 0.02;
			bgFrame = requestAnimationFrame(animBg);
		};
		bgFrame = requestAnimationFrame(animBg);

		return () => {
			io.disconnect();
			cancelAnimationFrame(bgFrame);
		};
	});

	onDestroy(() => {
		cancelAnimationFrame(bgFrame);
	});

	// ── BOOT SEQUENCE ─────────────────────────────────────────────────────────
	async function runBoot() {
		phase = 'boot';
		bootLines = [];
		for (let i = 0; i < BOOT_SEQUENCE.length; i++) {
			await sleep(i === 0 ? 200 : 120 + Math.random() * 180);
			bootLines = [...bootLines, BOOT_SEQUENCE[i]];
			scrollOutput();
		}
		await sleep(500);
		phase = 'menu';
		scrollOutput();
		await sleep(300);
		inputEl?.focus();
	}

	// ── INPUT HANDLING ────────────────────────────────────────────────────────
	function handleKey(e: KeyboardEvent) {
		if (e.key === 'Enter') submitInput();
	}

	async function submitInput() {
		const raw = inputValue.trim();
		inputValue = '';

		if (phase === 'menu' || phase === 'error') {
			const num = parseInt(raw);
			if (!isNaN(num) && num >= 1 && num <= contact.socials.length) {
				await showDetail(num - 1);
			} else if (raw.toLowerCase() === 'back' || raw === '0') {
				phase = 'menu';
			} else {
				errorMsg = `ERR: '${raw}' is not a valid channel index. Enter 1–${contact.socials.length} or BACK.`;
				phase = 'error';
			}
		} else if (phase === 'detail') {
			if (raw.toLowerCase() === 'back' || raw === '0') {
				phase = 'menu';
				selectedIndex = null;
				detailLines = [];
			} else if (raw.toLowerCase() === 'open' || raw === 'y') {
				if (selectedIndex !== null) {
					window.open(contact.socials[selectedIndex].href, '_blank', 'noopener noreferrer');
				}
			} else {
				errorMsg = `ERR: Type 'OPEN' to launch or 'BACK' to return.`;
				phase = 'error';
			}
		}

		scrollOutput();
		inputEl?.focus();
	}

	async function showDetail(index: number) {
		selectedIndex = index;
		detailLines = [];
		phase = 'input';

		const s = contact.socials[index];
		const lines = [
			`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
			`CHANNEL: ${s.label.toUpperCase()}`,
			`CODE:    [${s.code}]`,
			`TAG:     ${s.tag}`,
			`HANDLE:  ${s.handle}`,
			`LINK:    ${s.href}`,
			`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
			`Type OPEN to launch · BACK to return`,
		];

		for (const line of lines) {
			await sleep(80 + Math.random() * 100);
			detailLines = [...detailLines, line];
			scrollOutput();
		}
		phase = 'detail';
		inputEl?.focus();
	}

	function clickChannel(i: number) {
		if (phase === 'menu' || phase === 'error') {
			inputValue = String(i + 1);
			submitInput();
		}
	}

	function sleep(ms: number) {
		return new Promise<void>(r => setTimeout(r, ms));
	}

	function scrollOutput() {
		setTimeout(() => {
			if (outputEl) outputEl.scrollTop = outputEl.scrollHeight;
		}, 10);
	}

	// ── GLITCH TEXT ───────────────────────────────────────────────────────────
	function startGlitch() {
		const BASE = 'CONNECT PROTOCOL';
		let i = 0;
		const reveal = setInterval(() => {
			if (i <= BASE.length) glitchText = BASE.slice(0, i++);
			else {
				clearInterval(reveal);
				setInterval(() => {
					if (Math.random() > 0.93) {
						glitchText = BASE.split('').map(c =>
							Math.random() > 0.88 ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) : c
						).join('');
						setTimeout(() => (glitchText = BASE), 120);
					}
				}, 2000);
			}
		}, 75);
	}
</script>

<svelte:head>
	<style>
		@keyframes crtFlicker {
			0%,94%,99%,100% { opacity:1; }
			95% { opacity:0.87; }
			97% { opacity:0.93; }
		}
		@keyframes textShadowPulse {
			0%,100% { text-shadow: 0.5px 0 0 #00ff00,-0.5px 0 0 #ff0000; }
			50%     { text-shadow:-0.5px 0 0 #00ff00, 0.5px 0 0 #ff0000; }
		}
		@keyframes fadeInUp {
			from { opacity:0; transform:translateY(6px); }
			to   { opacity:1; transform:translateY(0); }
		}
		@keyframes dotBlink {
			0%,100% { opacity:1; } 50% { opacity:0; }
		}
		@keyframes rowEntrance {
			from { opacity:0; transform:translateX(-12px); }
			to   { opacity:1; transform:translateX(0); }
		}
		@keyframes float {
			from { transform:translateY(0) rotate(0deg); }
			to   { transform:translateY(-100vh) rotate(360deg); }
		}
		@keyframes holoPulse {
			0%,100% { opacity:0.5; }
			50%     { opacity:1; }
		}
		@keyframes scanDown {
			0%   { top: 0%; opacity:0.6; }
			100% { top: 100%; opacity:0; }
		}
		.panel-input:focus { outline: none; }
		.panel-input::selection { background: rgba(180,255,0,0.25); }
		.panel-input { caret-color: #B4FF00; }

		.holo-line {
			position: absolute;
			left: 0; width: 100%; height: 1px;
			background: linear-gradient(to right, transparent, rgba(180,255,0,0.4), transparent);
			animation: scanDown 3.5s linear infinite;
		}
	</style>
</svelte:head>

<section
	bind:this={sectionEl}
	id="contact"
	class="relative min-h-screen py-24 px-6 md:px-20 lg:px-32 overflow-hidden flex flex-col"
	style="animation:crtFlicker 10s infinite;"
>
	<!-- CRT scanline sweep -->
	<div
		class="absolute inset-0 pointer-events-none z-20 opacity-[0.06]"
		style="background:linear-gradient(transparent 50%,rgba(0,0,0,0.7) 50%);background-size:100% 4px;transform:translateY({scanlinePosition}%);"
	></div>

	<!-- Noise -->
	<div
		class="absolute inset-0 pointer-events-none z-10"
		style="background:radial-gradient(circle at 22% 28%,rgba(180,255,0,{noiseOpacity}) 1px,transparent 1px);background-size:48px 48px;"
	></div>

	<!-- VHS strips -->
	<div class="absolute top-0 left-0 w-full h-px bg-[#B4FF00]/20 blur-sm animate-pulse z-30"></div>
	<div class="absolute bottom-0 left-0 w-full h-px bg-[#00E5FF]/20 blur-sm z-30" style="animation:holoPulse 2.5s infinite 0.5s;"></div>

	<!-- Perspective grid -->
	<div class="absolute inset-0 pointer-events-none" style="perspective:500px;">
		<div
			class="absolute inset-0 opacity-[0.055]"
			style="background-image:linear-gradient(rgba(180,255,0,0.25) 1px,transparent 1px),linear-gradient(90deg,rgba(0,229,255,0.2) 1px,transparent 1px);background-size:52px 52px;transform:rotateX(60deg) scale(2.2);transform-origin:center top;"
		></div>
	</div>

	<!-- Floating binary -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden select-none">
		{#each {length:14} as _, i}
			<div
				class="absolute text-[#B4FF00]/6 font-mono text-[10px]"
				style="left:{(i*7.1)%100}%;top:{(i*8.3)%100}%;animation:float {7+(i%4)*2.5}s linear infinite;animation-delay:-{(i*1.9)%12}s;"
			>{['0101','1010','1100','0011','FFE0','00B4'][i%6]}</div>
		{/each}
	</div>

	<!-- Corner brackets — same style as Hero -->
	<div class="absolute top-8 left-6 md:left-16 w-8 h-8 border-t-2 border-l-2 border-[#B4FF00]/30 pointer-events-none"></div>
	<div class="absolute top-8 right-6 md:right-16 w-8 h-8 border-t-2 border-r-2 border-[#B4FF00]/30 pointer-events-none"></div>
	<div class="absolute bottom-8 left-6 md:left-16 w-8 h-8 border-b-2 border-l-2 border-[#00E5FF]/20 pointer-events-none"></div>
	<div class="absolute bottom-8 right-6 md:right-16 w-8 h-8 border-b-2 border-r-2 border-[#00E5FF]/20 pointer-events-none"></div>

	<!-- CONNECT watermark -->
	<div class="absolute -left-4 bottom-1/4 text-[16vw] font-black text-[#F5F5F5]/[0.016] select-none pointer-events-none leading-none -rotate-90 origin-left">CONNECT</div>

	<div class="relative max-w-7xl mx-auto w-full flex flex-col gap-16">

		<!-- ── HEADER ─────────────────────────────────────────────────────── -->
		<div
			class="flex items-center gap-4 transition-all duration-700 relative"
			style="opacity:{inView?1:0};transform:{inView?'translateY(0)':'translateY(24px)'};"
		>
			<div class="w-12 h-px bg-[#B4FF00] relative overflow-hidden">
				<div class="absolute inset-0 bg-[#B4FF00] blur-sm animate-pulse"></div>
			</div>
			<span class="font-mono text-[11px] text-[#B4FF00] tracking-[0.4em] uppercase relative">
				{glitchText || 'CONNECT PROTOCOL'}
				<span class="absolute -bottom-4 left-0 text-[6px] text-[#00E5FF]/50 whitespace-nowrap">&gt; SIGNAL ACQUIRED</span>
			</span>
			<div class="flex-1 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"></div>
			<span class="font-mono text-[10px] text-[#9CA3AF]/30 tracking-widest relative">
				§ 04
				<span class="absolute -top-3 right-0 text-[8px] text-[#B4FF00]/30">[ACTIVE]</span>
			</span>
		</div>

		<!-- ── TITLE + PANEL LAYOUT ───────────────────────────────────────── -->
		<div class="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 xl:gap-20 items-center">

			<!-- Left: title block -->
			<div
				class="transition-all duration-1000 delay-100"
				style="opacity:{inView?1:0};transform:{inView?'translateX(0)':'translateX(-40px)'};"
			>
				<h2 class="font-black leading-[0.85] tracking-tight mb-8">
					<span class="block text-[#9CA3AF]/30 font-mono text-sm tracking-[0.4em] mb-4 uppercase">
						<span class="text-[#B4FF00] mr-1">❯</span>Let's Talk_
					</span>
					<span class="block text-[#F5F5F5]" style="font-size:clamp(3rem,7vw,5.5rem);text-shadow:4px 4px 0 rgba(180,255,0,0.07),-2px -2px 0 rgba(0,229,255,0.07);">
						{contact.heading}
					</span>
					<span class="block text-[#B4FF00] relative" style="font-size:clamp(3rem,7vw,5.5rem);text-shadow:0 0 28px rgba(180,255,0,0.65),0 0 55px rgba(180,255,0,0.3);animation:textShadowPulse 2.5s infinite;">
						{contact.headingAccent}
						<span class="absolute -bottom-3 left-0 w-full h-1 bg-linear-to-r from-transparent via-[#B4FF00] to-transparent blur-md opacity-55"></span>
					</span>
				</h2>

				<p class="text-[#9CA3AF] text-[15px] leading-relaxed max-w-sm pl-4 border-l-2 border-[#B4FF00]/30 mb-10">
					{contact.subheading}
				</p>

				<!-- Mini stat row -->
				<div class="flex gap-6 font-mono text-[10px]">
					<div>
						<div class="text-[#B4FF00] text-lg font-black">{contact.socials.length}</div>
						<div class="text-[#9CA3AF]/50 tracking-widest">CHANNELS</div>
					</div>
					<div class="w-px bg-[#B4FF00]/15"></div>
					<div>
						<div class="text-[#00E5FF] text-lg font-black">24/7</div>
						<div class="text-[#9CA3AF]/50 tracking-widest">ONLINE</div>
					</div>
					<div class="w-px bg-[#B4FF00]/15"></div>
					<div>
						<div class="text-[#B4FF00] text-lg font-black">WIB</div>
						<div class="text-[#9CA3AF]/50 tracking-widest">UTC+7</div>
					</div>
				</div>
			</div>

			<!-- ── HOLOGRAM PANEL — no mouse tilt ────────────────────────── -->
			<div
				class="transition-all duration-1000 delay-200 flex justify-center lg:justify-end"
				style="opacity:{inView?1:0};transform:{inView?'translateX(0)':'translateX(50px)'};"
			>
				<div class="relative" style="width:420px;">

					<!-- Holographic glow frame -->
					<div class="absolute -inset-px rounded bg-linear-to-br from-[#B4FF00]/10 via-transparent to-[#00E5FF]/8 blur-sm pointer-events-none"></div>

					<!-- Glass panel body -->
					<div
						class="relative border border-[#B4FF00]/25 bg-black/92 overflow-hidden backdrop-blur-md"
						style="clip-path:polygon(0 0,94% 0,100% 6%,100% 100%,6% 100%,0 94%);"
					>
						<!-- Holographic scan line sweeping down -->
						<div class="holo-line pointer-events-none z-20"></div>
						<div class="holo-line pointer-events-none z-20" style="animation-delay:1.75s;"></div>

						<!-- Reflection overlay -->
						<div
							class="absolute inset-0 pointer-events-none z-10"
							style="background:linear-gradient(135deg,rgba(255,255,255,0.025) 0%,transparent 50%,rgba(180,255,0,0.015) 100%);"
						></div>

						<!-- Circuit SVG traces -->
						<svg class="absolute inset-0 w-full h-full opacity-[0.08] pointer-events-none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0 40 L80 40 L100 60 L420 60" stroke="#B4FF00" stroke-width="0.5" fill="none"/>
							<path d="M420 440 L340 440 L320 420 L0 420" stroke="#00E5FF" stroke-width="0.5" fill="none"/>
							<path d="M380 0 L380 80" stroke="#B4FF00" stroke-width="0.5" fill="none"/>
						</svg>

						<!-- Title bar -->
						<div class="flex items-center gap-2 px-5 py-3 border-b border-[#B4FF00]/20 bg-[#B4FF00]/4">
							<div class="flex gap-1.5">
								<div class="w-2.5 h-2.5 rounded-full bg-[#FF5F57]"><span class="sr-only">close</span></div>
								<div class="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]"></div>
								<div class="w-2.5 h-2.5 rounded-full bg-[#28C840]"></div>
							</div>
							<span class="font-mono text-[10px] text-[#B4FF00] tracking-[0.3em] ml-2 uppercase">connect_protocol.sys</span>
							<div class="ml-auto flex gap-0.5 items-end">
								{#each {length:5} as _, i}
									<div class="w-0.5 bg-[#B4FF00]" style="height:{5+i*2}px;opacity:{0.25+i*0.15};"></div>
								{/each}
							</div>
						</div>

						<!-- ── TERMINAL OUTPUT ── -->
						<div
							bind:this={outputEl}
							class="px-5 pt-4 pb-2 font-mono text-[11.5px] overflow-y-auto"
							style="min-height:320px;max-height:380px;scrollbar-width:none;"
						>
							<!-- Boot lines -->
							{#each bootLines as line, i}
								<div
									class="mb-0.5 leading-relaxed"
									style="
										color:{line.startsWith('━') ? 'rgba(180,255,0,0.25)' : line.includes('[OK]') ? '#B4FF00' : line.includes('SYSTEM READY') ? '#ffffff' : '#6B7280'};
										font-weight:{line.includes('CONNECT_PROTOCOL') || line.includes('SYSTEM READY') ? '700' : '400'};
										animation:fadeInUp 0.2s ease both;
										animation-delay:{i*0.04}s;
									"
								>{line}</div>
							{/each}

							<!-- MENU -->
							{#if phase === 'menu' || phase === 'error' || phase === 'input' || phase === 'detail'}
								<div class="mt-3 mb-1">
									{#each contact.socials as s, i}
										<!-- svelte-ignore a11y_no_static_element_interactions -->
										<!-- svelte-ignore a11y_click_events_have_key_events -->
										<div
											class="flex items-center gap-3 py-1.25 px-2 rounded cursor-pointer group transition-all duration-200"
											style="
												animation:rowEntrance 0.3s ease both;
												animation-delay:{i*0.05}s;
												background:{selectedIndex === i ? s.color + '12' : 'transparent'};
											"
											on:click={() => clickChannel(i)}
											on:mouseenter={(e) => { (e.currentTarget as HTMLElement).style.background = s.color + '0e'; }}
											on:mouseleave={(e) => { (e.currentTarget as HTMLElement).style.background = selectedIndex === i ? s.color + '12' : 'transparent'; }}
										>
											<span
												class="font-mono text-[10px] font-bold w-6 shrink-0 text-center border"
												style="
													color:{s.color};
													border-color:{s.color}40;
													background:{s.color}10;
													padding:1px 3px;
												"
											>{String(i + 1).padStart(2, '0')}</span>

											<div class="w-0.5 h-4 shrink-0 rounded-full" style="background:{s.color};opacity:0.6;"></div>

											<span class="text-[#E5E7EB] text-[12px] font-semibold tracking-wide flex-1">{s.label.toUpperCase()}</span>
											<span class="font-mono text-[8px] tracking-widest" style="color:{s.color}60;">{s.tag}</span>

											<svg class="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="color:{s.color};">
												<path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
											</svg>
										</div>
									{/each}
								</div>
							{/if}

							<!-- DETAIL LINES -->
							{#if phase === 'detail' || (phase === 'error' && selectedIndex !== null && detailLines.length > 0)}
								<div class="mt-3">
									{#each detailLines as line, i}
										{@const s = selectedIndex !== null ? contact.socials[selectedIndex] : null}
										<div
											class="mb-0.5 leading-relaxed"
											style="
												color:{line.startsWith('━') ? 'rgba(180,255,0,0.22)' : line.startsWith('CHANNEL') ? (s?.color ?? '#B4FF00') : line.includes('HANDLE') || line.includes('LINK') ? '#E5E7EB' : '#6B7280'};
												font-weight:{line.startsWith('CHANNEL') ? '700' : '400'};
												animation:fadeInUp 0.2s ease both;
												animation-delay:{i*0.04}s;
											"
										>{line}</div>
									{/each}
								</div>
							{/if}

							<!-- ERROR MSG -->
							{#if phase === 'error' && errorMsg}
								<div class="mt-2 text-[#FF4444] text-[10px] font-mono" style="animation:fadeInUp 0.2s ease;">{errorMsg}</div>
							{/if}
						</div>

						<!-- ── INPUT ROW ── -->
						<div class="border-t border-[#B4FF00]/15 px-5 py-3 flex items-center gap-3 bg-[#B4FF00]/2">
							<span class="font-mono text-[#B4FF00] text-[12px] select-none" style="text-shadow:0 0 8px rgba(180,255,0,0.5);">❯</span>
							<input
								bind:this={inputEl}
								bind:value={inputValue}
								on:keydown={handleKey}
								type="text"
								class="panel-input flex-1 bg-transparent font-mono text-[12px] text-[#E5E7EB] placeholder-[#4B5563] border-none"
								placeholder={
									phase === 'boot' ? 'booting...' :
									phase === 'detail' ? "type 'OPEN' or 'BACK'" :
									`enter channel [1–${contact.socials.length}]`
								}
								disabled={phase === 'boot' || phase === 'input'}
								autocomplete="off"
								spellcheck="false"
							/>
							<button
								on:click={submitInput}
								class="font-mono text-[9px] tracking-widest px-2 py-1 border border-[#B4FF00]/30 text-[#B4FF00] hover:bg-[#B4FF00]/10 transition-colors duration-200 disabled:opacity-30"
								disabled={phase === 'boot' || phase === 'input'}
							>SEND</button>
						</div>

						<!-- Hint row -->
						<div class="px-5 pb-3 font-mono text-[8px] text-[#4B5563] tracking-widest flex items-center gap-4">
							<span>CLICK ROW OR TYPE NUMBER</span>
							<span class="ml-auto flex items-center gap-1">
								<span class="w-1.5 h-1.5 rounded-full bg-[#28C840]" style="animation:dotBlink 2s infinite;"></span>
								ONLINE
							</span>
						</div>

						<!-- Corner marks -->
						<div class="absolute top-2 right-2 w-3 h-3 border-t border-r border-[#B4FF00]/30 pointer-events-none"></div>
						<div class="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-[#00E5FF]/20 pointer-events-none"></div>
					</div>

					<!-- Outer glow -->
					<div class="absolute -inset-4 rounded-xl pointer-events-none" style="background:radial-gradient(ellipse 80% 60% at 50% 50%,rgba(180,255,0,0.04) 0%,transparent 70%);"></div>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	@keyframes float {
		from { transform:translateY(0) rotate(0deg); }
		to   { transform:translateY(-100vh) rotate(360deg); }
	}
	@keyframes dotBlink {
		0%,100% { opacity:1; } 50% { opacity:0.15; }
	}
	@keyframes holoPulse {
		0%,100% { opacity:0.5; } 50% { opacity:1; }
	}
	div[style*="scrollbar-width:none"] { scrollbar-width: none; }
	div[style*="scrollbar-width:none"]::-webkit-scrollbar { display: none; }
</style>