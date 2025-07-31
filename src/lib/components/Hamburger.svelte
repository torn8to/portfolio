<script>
	export let open = false;
</script>

<button
	aria-label="menu-burger-button"
	class="text-white bg-transparent border-transparent flex justify-center items-center z-20"
	class:open
	on:click={() => (open = !open)}
>
	<svg width="32" height="24" class="transition-transform duration-300 ease-in-out">
		<line id="top" x1="0" y1="2" x2="32" y2="2" />
		<line id="middle" x1="0" y1="12" x2="32" y2="12" />
		<line id="bottom" x1="0" y1="22" x2="32" y2="22" />
	</svg>
</button>

<style>
	svg line {
		stroke: currentColor;
		stroke-width: 3;
		transition: transform 0.3s ease-in-out;
	}

	.open svg {
		transform: scale(0.7);
	}

	.open #top {
		transform: translate(6px, 0px) rotate(45deg);
	}

	.open #middle {
		stroke-dasharray: 0;
		stroke-dashoffset: 0;
		animation: fade 1s ease-in alternate forwards;
	}

	@keyframes fade {
		to {
			stroke-dashoffset: 1000;
			stroke-dasharray: 1000;
		}
	}

	.open #bottom {
		transform: translate(-12px, 9px) rotate(-45deg);
	}
</style> 