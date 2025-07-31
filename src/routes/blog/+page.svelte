<script>
	import { onMount } from 'svelte';
	import posts from '$lib/Posts.js';
	
	let filteredArticles = posts;
	let isMounted = false;
	let Carta;
	let defaultExtensions;
	let math;
	let code;
	
	// Helper function to handle tags that could be arrays or strings
	function formatTags(tags) {
		if (Array.isArray(tags)) {
			return tags.join(', ');
		} else if (typeof tags === 'string') {
			return tags;
		}
		return '';
	}
	
	onMount(async () => {
		isMounted = true;
	});
</script>

<svelte:head>
	<title>Nathan Rogers — Blog</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
</svelte:head>

<div class="articlesContainer">
	<div class="articles">
		<h1>Articles</h1>
		
		{#if filteredArticles && filteredArticles.length > 0}
			{#each filteredArticles as article}
				<div class="article">
					<div class="header">
						<h2>{article.title}</h2>
						<div>Tags: {formatTags(article.tags || article.technologies)}</div>
					</div>
					
					{#if article.description}
						<div class="markdown-content">
							{#if isMounted && Carta}
								<svelte:component 
									this={Carta}
									value={article.description} 
									readonly={true}
									extensions={[
										...defaultExtensions(),
										math(),
										code({ theme: 'github-dark' })
									]}
								/>
							{:else}
								<p>{article.description}</p>
							{/if}
						</div>
					{:else}
						<p></p>
					{/if}
					
					<div class="flex justify-end">
						<a 
							href={article.slug ? `/blog/${article.slug}` : '#'} 
							class="button"
						>
							Read Article
						</a>
					</div>
				</div>
			{/each}
		{:else}
			<div class="text-white">No Articles</div>
		{/if}
	</div>
</div>

<style>
	.articlesContainer {
		width: 100%;
		max-width: 900px;
		display: flex;
		justify-content: center;
		box-sizing: border-box;
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	a {
		text-decoration: none;
	}

	.articlesContainer .articles {
		display: grid;
		grid-template-columns: 1fr;
		grid-gap: 40px;
		margin-top: 30px;
	}

	h2 {
		display: flex;
	}

	.articles > h1 {
		font-weight: 700;
		text-align: start;
		margin: 0;
		font-size: 36px;
	}

	.article {
		text-align: start;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		color: white;
		background: #111;
		padding: 2rem;
		width: 100%;
		border-radius: 25px;
		transition: transform 0.2s ease-in-out;
	}

	.article p {
		font-weight: 100;
		color: #708090;
	}

	.articles {
		width: 100%;
		margin: 50px auto;
		display: grid;
		grid-gap: 1rem;
		grid-template-columns: 1fr;
	}

	.button {
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		border: 2px solid white;
		padding: 10px;
		width: 120px;
		font-size: 14px;
	}

	.markdown-content {
		color: #d0d0d0;
		line-height: 1.6;
		margin-bottom: 1.5rem;
	}

	.header {
		margin-bottom: 1rem;
	}

	@media (min-width: 900px) {
		.articlesContainer {
			padding: 0;
		}
		.articles > h1 {
			font-size: 48px;
			margin: 0 0 50px 0;
		}

		.articles {
			grid-template-columns: 1fr;
		}

		.articles .article {
			min-height: 200px;
		}
	}
	
	:global(.carta-editor) {
		background-color: transparent !important;
		color: #d0d0d0 !important;
	}
	
	:global(.carta-editor .cm-editor) {
		background-color: transparent !important;
	}
	
	:global(.carta-editor .cm-content) {
		color: #d0d0d0 !important;
	}
	
	:global(.carta-editor .cm-line) {
		color: #d0d0d0 !important;
	}
	
	:global(.carta-md-preview) {
		background-color: transparent !important;
		color: #d0d0d0 !important;
	}
	
	:global(.carta-md-preview h1),
	:global(.carta-md-preview h2),
	:global(.carta-md-preview h3),
	:global(.carta-md-preview h4),
	:global(.carta-md-preview h5),
	:global(.carta-md-preview h6) {
		color: white !important;
	}
	
	:global(.carta-md-preview a) {
		color: #4dabf7 !important;
	}
	
	:global(.carta-md-preview code) {
		background-color: #222 !important;
	}
	
	:global(.carta-md-preview pre) {
		background-color: #222 !important;
	}
</style> 