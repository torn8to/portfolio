<script>
	import { modalOpened } from '$lib/store';
	let isOpen = false;
	let closing = false;

	modalOpened.subscribe((value) => {
		closing = false;
		isOpen = value;
	});

	const close = () => {
		closing = true;
		setTimeout(() => {
			modalOpened.set(false);
		}, 300);
	};
</script>

{#if isOpen}
	<div class={`fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[2000] flex justify-center items-center ${closing ? 'closing' : ''}`}>
		<div 
			class="absolute w-full h-full bg-black/50 backdrop-blur-md animate-[slidein_0.3s_ease-in-out] closing:animate-[slideOut_0.3s_ease-in-out]" 
			on:click={close} 
			role="button" 
			tabindex="0" 
			on:keypress={close}
			aria-label="Close modal"
		></div>
		<div class="z-10 max-w-[70vw] rounded-md overflow-hidden p-8 md:p-12 rounded-3xl bg-gradient-to-br from-white/15 to-transparent backdrop-blur-xl shadow-lg shadow-black/10 animate-[openModalAnimation_0.3s_ease-in-out] closing:animate-[closeModalAnimation_0.3s_ease-in-out] md:min-w-[400px]">
			<div class="max-h-[50vh] overflow-hidden">
				<slot name="content"></slot>
			</div>
		</div>
	</div>
{/if}

<style>
	@keyframes slidein {
		from { opacity: 0; }
		to { opacity: 1; }
	}

	@keyframes slideOut {
		from { opacity: 1; }
		to { opacity: 0; }
	}

	@keyframes openModalAnimation {
		from { opacity: 0; transform: scale(0); }
		to { opacity: 1; transform: scale(1); }
	}

	@keyframes closeModalAnimation {
		from { opacity: 1; transform: scale(1); }
		to { opacity: 0; transform: scale(0); }
	}

	.closing .backdrop {
		animation: slideOut 0.3s ease-in-out;
	}
	
	.closing .content-wrapper {
		animation: closeModalAnimation 0.3s ease-in-out;
	}
</style> 