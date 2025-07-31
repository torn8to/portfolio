<script lang="ts">
	export let tooltip: string;
</script>

<div data-tooltip={tooltip} class="relative z-10 inline-block tooltip-container">
	<slot />
	<span class="tooltip-text absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 py-2 px-4 bg-gray-800/90 text-white text-base md:text-lg rounded whitespace-nowrap opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-opacity duration-200">
		{tooltip}
		<span class="tooltip-arrow absolute top-full left-1/2 transform -translate-x-1/2 border-solid border-t-gray-800/90 border-t-4 border-x-transparent border-x-4 border-b-0"></span>
	</span>
</div>

<style>
	.tooltip-container {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
	
	.tooltip-container:hover .tooltip-text {
		visibility: visible;
		opacity: 1;
	}
	
	.tooltip-text {
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.2s ease-out;
		font-weight: 500;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
	}
</style> 