<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import Preloader from '$lib/components/Preloader.svelte';

	let showPreloader = $state(true);
	let { children } = $props();

	function handleDone() {
		showPreloader = false;
	}

	onMount(() => {
		const lenis = new Lenis();

		function raf(time: number) {
			lenis.raf(time);
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);
	});
</script>

<svelte:head>
	<link rel="icon" href="/image/favicon.svg" type="image/svg+xml" />
</svelte:head>

{@render children()}

{#if showPreloader}
	<Preloader ondone={handleDone} />
{/if}