<script lang="ts">
	import routes from '$lib/NavRoutes';
	import { page } from '$app/stores';
	
	let segment = $page.url.pathname;
</script>

<nav class="w-full max-w-[900px] box-border py-5 px-0 md:px-0 h-20 flex flex-col justify-center items-center mx-auto">
	<div class="flex justify-between items-center w-full max-w-[900px] box-border">
		<a href="/" class="h-[30px] w-[30px] flex items-center overflow-hidden">
			<img src="/logo.svg" alt="logo" class="h-[30px] w-[30px] cursor-pointer" width="30" height="30" style="max-width: 30px; max-height: 30px;" />
		</a>
		
		<div class="flex justify-end items-center font-medium">
			{#each routes as route}
				<a 
					class={`p-0 mx-[10px] cursor-pointer transition-colors duration-200 no-underline relative text-white/40 hover:after:content-[''] hover:after:bg-[#ca3c25] hover:after:block hover:after:h-[3px] hover:after:w-full hover:after:absolute hover:after:bottom-0 ${segment === route.href ? 'text-white after:content-[\'\'] after:bg-[#ca3c25] after:block after:h-[3px] after:w-full after:absolute after:bottom-0' : ''}`} 
					href={route.href}
				>
					{route.label}
				</a>
			{/each}
		</div>
	</div>
</nav> 