<script lang="ts">
	let button: HTMLButtonElement;

	function handleMove(e: MouseEvent) {
		const rect = button.getBoundingClientRect();
		const x = e.clientX - rect.left - rect.width / 2;
		const y = e.clientY - rect.top - rect.height / 2;

		button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
	}

	function reset() {
		button.style.transform = 'translate(0px,0px)';
	}
</script>

<button
	bind:this={button}
	on:mousemove={handleMove}
	on:mouseleave={reset}
	class="px-8 py-4 border border-neon text-neon rounded-full transition duration-300 hover:bg-neon hover:text-black"
>
	Contact Me
</button>