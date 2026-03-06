<script lang="ts">
	import { onMount } from 'svelte';

	let audio: HTMLAudioElement;
	let playing = false;

	onMount(() => {
		audio = new Audio('/audio/ambient.mp3');
		audio.loop = true;
		audio.volume = 0.4;
	});

	function toggle() {
		if (!playing) {
			audio.play();
		} else {
			audio.pause();
		}
		playing = !playing;
	}
</script>

<button
	on:click={toggle}
	class="fixed top-3 left-6 z-50 w-10 h-10 rounded-full border border-neon flex items-center justify-center backdrop-blur-md text-neon hover:scale-110 transition"
>
	{playing ? '🔊' : '🔇'}
</button>