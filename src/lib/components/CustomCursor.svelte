<script lang="ts">
	import { onMount } from 'svelte';

	let cursor: HTMLDivElement;

	onMount(() => {
		const handleMove = (e: MouseEvent) => {
			if (!cursor) return;
			cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
		};

		window.addEventListener('mousemove', handleMove);
		return () => window.removeEventListener('mousemove', handleMove);
	});
</script>

<div
	bind:this={cursor}
	class="fixed w-6 h-6 border border-neon rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 z-50"
></div>