<script>
	import { goto } from '$app/navigation';
	import { Email } from '$lib/Constants';
</script>

<div
	class="cursor-pointer h-10 max-w-[200px] rounded-lg bg-[#ca3c25] bg-[length:150%_150%] flex justify-center items-center font-medium hover:animate-gradient"
	role="button"
	tabindex="0"
	on:keypress={() => {
		goto(`mailto:${Email}`);
	}}
	on:click={() => goto(`mailto:${Email}`)}
>
	<slot />
</div>

<style>
	@keyframes gradient {
		0% { background-position: 0% 50%; }
		50% { background-position: 100% 50%; }
		100% { background-position: 0% 50%; }
	}
	
	.hover\:animate-gradient:hover {
		animation: gradient 2s ease infinite;
	}
</style> 