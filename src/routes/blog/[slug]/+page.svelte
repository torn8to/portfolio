<script>
	import { onMount, afterUpdate } from 'svelte';
	import { Carta, Markdown } from 'carta-md';
  	import { math } from '@cartamd/plugin-math';
  	import { code } from '@cartamd/plugin-code';
	import adcFastMd from '../../../content/blog/adc-fast.md?raw';
	import lidarOdometryMd from '../../../content/blog/lidar-odometry.md?raw';
	import samplePostMd from '../../../content/blog/sample-post.md?raw';
	import secondPostMd from '../../../content/blog/second-post.md?raw';
	
	/** @type {import('./$types').PageData} */
	export let data;
	
	const article = { ...data.post };
	let isMounted = false;
	let markdownContent = '';
	let markdownContainer;
	let tocProcessed = false;
	
	// Create carta instance with extensions
	const carta = new Carta({
		sanitizer: false,
		extensions: [
			math(),
			code({ theme: 'github-dark' })
		],
		options: {
			// Enable anchor links for headers
			renderHtml: true,
			skipHtml: false,
			linkify: true,
			typographer: true,
			// Add IDs to headers for linking
			headerIds: true,
			headerPrefix: 'section-'
		}
	});
	
	// Helper function to handle tags that could be arrays or strings
	function formatTags(tags) {
		if (Array.isArray(tags)) {
			return tags;
		} else if (typeof tags === 'string') {
			return tags.split(',').map(tag => tag.trim());
		}
		return [];
	}
	
	// Function to format date
	function formatDate(dateString) {
		if (!dateString) return '';
		
		try {
			const date = new Date(dateString);
			return date.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch (error) {
			console.error('Error formatting date:', error);
			return dateString; // Return the original string if parsing fails
		}
	}
	
	// Function to parse frontmatter and extract body content
	function parseMarkdown(markdown) {
		if (!markdown) return { frontmatter: {}, body: '' };
		
		const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
		const match = markdown.match(frontmatterRegex);
		
		if (!match) {
			// No frontmatter found, return the entire content as body
			return { frontmatter: {}, body: markdown };
		}
		
		// Parse frontmatter
		const frontmatterText = match[1];
		const body = match[2];
		const frontmatter = {};
		
		// Simple frontmatter parser (key: value format)
		frontmatterText.split('\n').forEach(line => {
			const colonIndex = line.indexOf(':');
			if (colonIndex !== -1) {
				const key = line.slice(0, colonIndex).trim();
				const value = line.slice(colonIndex + 1).trim();
				frontmatter[key] = value;
			}
		});
		
		return { frontmatter, body };
	}
	
	// Function to generate a clean ID from header text
	function generateId(text) {
		return text
			.toLowerCase()
			.replace(/[^\w\s-]/g, '')
			.replace(/\s+/g, '-');
	}
	
	// Function to process the rendered markdown DOM to add header IDs and TOC
	function processRenderedMarkdown() {
		if (!markdownContainer || tocProcessed) return;
		
		// Get the container with rendered markdown
		const container = markdownContainer.querySelector('.carta-md-preview');
		if (!container) {
			console.log('Markdown preview container not found, retrying...');
			setTimeout(processRenderedMarkdown, 200);
			return;
		}
		
		// Find all headers
		const headers = container.querySelectorAll('h2, h3, h4, h5, h6');
		if (headers.length === 0) {
			console.log('No headers found, retrying...');
			setTimeout(processRenderedMarkdown, 200);
			return;
		}
		
		console.log(`Found ${headers.length} headers`);
		
		// Add IDs to all headers
		const headerData = [];
		headers.forEach((header) => {
			const level = parseInt(header.tagName.substring(1));
			const text = header.textContent;
			const id = generateId(text);
			
			// Add ID to the header
			header.id = id;
			
			// Store header data for TOC generation
			headerData.push({ level, text, id });
		});
		
		// Create TOC container
		const tocContainer = document.createElement('div');
		tocContainer.className = 'toc-container';
		
		const tocTitle = document.createElement('h2');
		tocTitle.textContent = 'Table of Contents';
		tocContainer.appendChild(tocTitle);
		
		// Generate TOC HTML
		const tocList = document.createElement('ul');
		tocList.className = 'table-of-contents';
		
		let currentLevel = 2; // Start at h2 level
		let listStack = [tocList];
		
		headerData.forEach((header) => {
			// Handle nesting
			if (header.level > currentLevel) {
				// Go deeper
				for (let i = currentLevel; i < header.level; i++) {
					const newList = document.createElement('ul');
					if (listStack[listStack.length - 1].lastChild) {
						const li = listStack[listStack.length - 1].lastChild;
						li.appendChild(newList);
						listStack.push(newList);
					} else {
						const li = document.createElement('li');
						listStack[listStack.length - 1].appendChild(li);
						li.appendChild(newList);
						listStack.push(newList);
					}
				}
				currentLevel = header.level;
			} else if (header.level < currentLevel) {
				// Go up
				for (let i = currentLevel; i > header.level; i--) {
					listStack.pop();
				}
				currentLevel = header.level;
			}
			
			// Create list item with link
			const listItem = document.createElement('li');
			const link = document.createElement('a');
			link.href = `#${header.id}`;
			link.textContent = header.text;
			listItem.appendChild(link);
			listStack[listStack.length - 1].appendChild(listItem);
		});
		
		// Add TOC to container
		tocContainer.appendChild(tocList);
		
		// Insert TOC after the first heading
		const firstHeading = container.querySelector('h1, h2');
		if (firstHeading && firstHeading.parentNode) {
			// Insert after the first heading
			if (firstHeading.nextSibling) {
				firstHeading.parentNode.insertBefore(tocContainer, firstHeading.nextSibling);
			} else {
				firstHeading.parentNode.appendChild(tocContainer);
			}
		} else {
			// Insert at the beginning if no heading found
			container.insertBefore(tocContainer, container.firstChild);
		}
		
		console.log('TOC generated with links to', headerData.length, 'headers');
		tocProcessed = true;
	}
	
	onMount(() => {
		// Choose markdown content based on slug
		if (article) {
			let fullMarkdown;
			switch (article.slug) {
				case 'adc-fast':
					fullMarkdown = adcFastMd;
					break;
				case 'sample-post':
					fullMarkdown = samplePostMd;
					break;
				case 'second-post':
					fullMarkdown = secondPostMd;
					break;
        case 'lidar-odometry':
          fullMarkdown = lidarOdometryMd;
          break;
				default:
					fullMarkdown = article.description;
			}
			
			// Parse the markdown to get frontmatter and body
			const { frontmatter, body } = parseMarkdown(fullMarkdown);
			
			// Override article data with frontmatter
			if (frontmatter) {
				// Override title if present in frontmatter
				if (frontmatter.title) {
					article.title = frontmatter.title;
				}
				
				// Override tags if present in frontmatter
				if (frontmatter.tags) {
					article.tags = frontmatter.tags;
				}
				
				// Add date if present in frontmatter
				if (frontmatter.date) {
					article.date = frontmatter.date;
				}
				
				// Override any other fields
				Object.assign(article, frontmatter);
			}
			
			// Set the markdown content for rendering
			markdownContent = body;
		}
		
		isMounted = true;
	});
	
	// Process the rendered markdown after updates
	afterUpdate(() => {
		if (isMounted && markdownContainer && !tocProcessed) {
			// Use a longer delay to ensure the markdown is fully rendered
			setTimeout(processRenderedMarkdown, 1000);
		}
	});
</script>

<svelte:head>
	<title>{article?.title || 'Blog Post'} — Nathan Rogers</title>
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
</svelte:head>

<div class="article-container">
	{#if article}
		<div class="article">
			<h1>{article.title}</h1>
			
			<div class="metadata">
				<div class="tags">
					{#each formatTags(article.tags) as tag}
						<span class="tag">{tag}</span>
					{/each}
				</div>
				
				{#if article.date}
					<div class="date">
						{formatDate(article.date)}
					</div>
				{/if}
			</div>
			
			<div class="markdown-content" bind:this={markdownContainer}>
				{#if isMounted}
					<Markdown 
						value={markdownContent || article.description} 
						{carta}
					/>
				{:else}
					<p>{article.description}</p>
				{/if}
			</div>
			
			<div class="flex justify-end">
				<a href="/blog" class="button">
					← Back
				</a>
			</div>
		</div>
	{:else}
		<div class="not-found">
			<h1>Article Not Found</h1>
			<p>The article you're looking for doesn't exist or has been removed.</p>
			<div class="flex justify-end">
				<a href="/blog" class="button">
					← Back
				</a>
			</div>
		</div>
	{/if}
</div>

<style>
	.article-container {
		width: 100%;
		max-width: 800px;
		margin: 0 auto;
		padding: 2rem 1rem;
	}
	
	.article {
		background: #111;
		padding: 2rem;
		border-radius: 25px;
		color: white;
	}
	
	/* More specific selectors for headers with !important flag */
	.article h1,
	.article h2,
	.article h3,
	.article h4,
	.article h5,
	.article h6 {
		padding-top: 5px !important;
	}
	
	:global(.carta-md-preview h1),
	:global(.carta-md-preview h2),
	:global(.carta-md-preview h3),
	:global(.carta-md-preview h4),
	:global(.carta-md-preview h5),
	:global(.carta-md-preview h6) {
		padding-top: 5px !important;
	}
	
	/* Add border to better visualize the padding */
	:global(.carta-md-preview h1),
	:global(.carta-md-preview h2),
	:global(.carta-md-preview h3),
	:global(.carta-md-preview h4),
	:global(.carta-md-preview h5),
	:global(.carta-md-preview h6) {
		border-top: 1px solid #333;
	}
	
	h1 {
		font-size: 2.5rem;
		margin-top: 0;
		margin-bottom: 1rem;
		padding-top: 5px !important;
	}
	
	.metadata {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2rem;
		color: #708090;
		font-size: 0.9rem;
	}
	
	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	
	.tag {
		background: #222;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
	}
	
	.date {
		font-style: italic;
		color: #a0a0a0;
	}
	
	.markdown-content {
		color: #d0d0d0;
		line-height: 1.6;
		margin-bottom: 2rem;
	}
	
	/* Add vertical padding to paragraphs */
	:global(.carta-md-preview p) {
		margin: 1.2rem 0;
		padding: 0.5rem 0;
	}
	
	/* Add spacing between consecutive paragraphs */
	:global(.carta-md-preview p + p) {
		margin-top: 1.5rem;
	}
	
	.button {
		display: inline-flex;
		justify-content: center;
		align-items: center;
		color: white;
		border: 2px solid white;
		padding: 10px;
		width: 120px;
		font-size: 14px;
	}
	
	.not-found {
		text-align: center;
		padding: 3rem 1rem;
		color: white;
	}
	
	a {
		text-decoration: none;
	}
	
	/* Table of contents styling */
	:global(.carta-md-preview nav.table-of-contents) {
		margin: 2.5rem 0;
		padding: 1.5rem;
		background-color: #1a1a1a;
		border-radius: 8px;
		border-left: 4px solid #4dabf7;
	}
	
	:global(.carta-md-preview nav.table-of-contents::before) {
		content: "Table of Contents";
		display: block;
		font-size: 1.2rem;
		font-weight: bold;
		color: #4dabf7;
		margin-bottom: 1rem;
		border-bottom: 1px solid #333;
		padding-bottom: 0.5rem;
	}
	
	:global(.carta-md-preview nav.table-of-contents ul) {
		margin-bottom: 0;
		padding-left: 1.5rem;
	}
	
	:global(.carta-md-preview nav.table-of-contents li) {
		margin: 0.5rem 0;
		list-style-type: none;
		position: relative;
	}
	
	:global(.carta-md-preview nav.table-of-contents li::before) {
		content: "•";
		color: #4dabf7;
		position: absolute;
		left: -1rem;
	}
	
	:global(.carta-md-preview nav.table-of-contents a) {
		color: #4dabf7 !important;
		text-decoration: none;
		transition: all 0.2s ease;
		padding: 2px 5px;
		border-radius: 3px;
	}
	
	:global(.carta-md-preview nav.table-of-contents a:hover) {
		color: #90caf9 !important;
		text-decoration: underline;
		background-color: rgba(77, 171, 247, 0.1);
	}
	
    :global(.article-container li){
		margin-top: 1rem;
	}
	/* Add spacing between sections */
    :global(.article-container h1){
		margin-top: 2.5rem;
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	:global(.article-container h2){
		margin-top: 1.5rem;
		margin-bottom: 0.25rem;
		font-size: 1.25rem;
	}


	/* Custom TOC container styling */
	:global(.toc-container) {
		margin: 2.5rem 0;
		padding: 1.5rem;
		background-color: #1a1a1a;
		border-radius: 8px;
		border-left: 4px solid #4dabf7;
	}
	
	:global(.toc-container h2) {
		margin-top: 0 !important;
		color: #4dabf7 !important;
		margin-bottom: 1rem;
		border-bottom: 1px solid #333;
		padding-bottom: 0.5rem;
		padding-top: 0 !important; /* Override padding for TOC heading */
		border-top: none !important; /* Remove border for TOC heading */
	}
	
	:global(.table-of-contents) {
		margin-bottom: 0;
		padding-left: 1.5rem;
	}
	
	:global(.table-of-contents li) {
		margin: 0.5rem 0;
		list-style-type: none;
		position: relative;
	}
	
	:global(.table-of-contents li::before) {
		content: "•";
		color: #4dabf7;
		position: absolute;
		left: -1rem;
	}
	
	:global(.table-of-contents a) {
		color: #4dabf7 !important;
		text-decoration: none;
		transition: all 0.2s ease;
		padding: 2px 5px;
		border-radius: 3px;
	}
	
	:global(.table-of-contents a:hover) {
		color: #90caf9 !important;
		text-decoration: underline;
		background-color: rgba(77, 171, 247, 0.1);
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
