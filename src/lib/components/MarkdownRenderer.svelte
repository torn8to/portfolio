<script>
  import { onMount } from 'svelte';
  
  // Props
  export let value = '';
  export let readonly = true;
  
  let container;
  let carta;
  
  onMount(async () => {
    try {
      // Dynamically import Carta to avoid TypeScript import issues
      const { Carta, defaultExtensions } = await import('carta-md');
      const { math } = await import('@cartamd/plugin-math');
      const { code } = await import('@cartamd/plugin-code');
      
      // Create new instance
      carta = new Carta({
        target: container,
        props: {
          value,
          readonly,
          extensions: [
            ...defaultExtensions(),
            math(),
            code({ theme: 'github-dark' })
          ],
          options: {
            renderHtml: true,
            skipHtml: false
          }
        }
      });
    } catch (error) {
      console.error('Error initializing Carta:', error);
    }
    
    return () => {
      if (carta) {
        carta.$destroy();
      }
    };
  });
</script>

<div bind:this={container} class="w-full">
  {#if !carta}
    <p class="text-gray-300">Loading...</p>
  {/if}
</div>

<style>
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