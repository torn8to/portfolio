<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';
	import { customBackground } from '$lib/store';
	import NavBar from '$lib/components/NavBar.svelte';
	import Modal from '$lib/components/Modal.svelte';
	import { Email } from '$lib/Constants';
</script>

<div class="min-h-screen flex flex-col bg-[#0a0908] text-white" style="background-color: {$customBackground};">
	<!-- Navigation -->
	<NavBar />
	<!-- Main content -->
	<main class="flex-grow w-full max-w-5xl mx-auto">
		<slot />
	</main>

	<!-- Footer -->
	<footer class="py-8 text-center text-base w-full max-w-5xl mx-auto">
		Created by <a href="/about" class="text-[#ff3e00] no-underline">Nathan Rogers</a>  with
		<span class="text-[#ff3e00]">Svelte</span>
	</footer>
</div>

<Modal>
	<div slot="content" class="text-center">
		<h1 class="text-2xl mb-4">Email:</h1>
		<div class="flex items-center justify-center mb-5 gap-2">
			<p class="m-0">{Email}</p>
		</div>
	</div>
</Modal>
