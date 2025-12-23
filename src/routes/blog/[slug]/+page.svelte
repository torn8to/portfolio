<script>
  let { data } = $props();

  let article = $derived(data.post);
  let renderedContent = $derived(data.content);

  // Helper function to handle tags that could be arrays or strings
  function formatTags(tags) {
    if (Array.isArray(tags)) {
      return tags;
    } else if (typeof tags === "string") {
      return tags.split(",").map((tag) => " " + tag.trim());
    }
    return [];
  }

  // Function to format date
  function formatDate(dateString) {
    if (!dateString) return "";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }

  // Reactive state for GitHub
  let githubUrl = $derived(article?.github || "");
  let githubViz = $derived(
    article?.owner && article?.repo
      ? `https://opengraph.githubassets.com/1a/${article.owner}/${article.repo}`
      : "",
  );
  let openGithub = $derived(!!article?.github);
</script>

<svelte:head>
  <title>{article?.title || "Blog Post"} — Nathan Rogers</title>
</svelte:head>

<div class="article-container">
  {#if article}
    <div class="article">
      <h1>{article.title}</h1>

      <div class="metadata">
        <!-- 
        <div class="tags">
          {#each formatTags(article.tags) as tag}
            <span class="tag">{tag}</span>
          {/each}
        </div>-->

        {#if article.date}
          <div class="date">
            {formatDate(article.date)}
          </div>
        {/if}
      </div>

      {#if openGithub}
        <div class="github rounded-md overflow-hidden">
          <a href={githubUrl}>
            <img
              class="rounded-md overflow-hidden"
              src={githubViz}
              alt="GitHub"
            />
          </a>
        </div>
      {/if}

      <div class="markdown-content">
        {#if renderedContent}
          <div class="prose prose-invert max-w-none">
            {@html renderedContent}
          </div>
        {:else}
          <p>{article.description}</p>
        {/if}
      </div>

      <div class="flex justify-end">
        <a href="/blog" class="button"> ← Back </a>
      </div>
    </div>
  {:else}
    <div class="not-found">
      <h1>Article Not Found</h1>
      <p>The article you're looking for doesn't exist or has been removed.</p>
      <div class="flex justify-end">
        <a href="/blog" class="button"> ← Back </a>
      </div>
    </div>
  {/if}
</div>

<style>
  .github {
    max-width: 80% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2rem;
    border-radius: 12px !important;
    overflow: hidden;
  }

  .github img {
    height: auto;
    max-width: 80%;
  }

  :global(.markdown-content) {
    --shiki-background: #0d1117;
  }

  :global(.markdown-content pre) {
    padding: 1.25rem !important;
    border-radius: 0.75rem !important;
    margin: 1.5rem 0 !important;
    border: 1px solid #30363d !important;
    background-color: var(--shiki-background) !important;
  }

  :global(.markdown-content code) {
    font-family: "Fira Code", monospace !important;
    font-size: 0.9em !important;
  }

  :global(.markdown-content p) {
    margin-bottom: 1.5rem;
    line-height: 1.75;
  }

  :global(.markdown-content h1) {
    margin-bottom: 1.5rem;
    line-height: 1.75;
  }

  :global(.markdown-content img) {
    margin-bottom: 1.5rem;
    line-height: 1.75;
    max-width: 80%;
    border-radius: 12px !important;
  }
</style>
