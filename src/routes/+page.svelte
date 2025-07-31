<script>
  import { modalOpened } from '$lib/store.js';
  import Tooltip from '$lib/components/Tooltip.svelte';
</script>

<svelte:head>
  <title>Nathan Rogers - Main page</title>
</svelte:head>

<main class="flex flex-col justify-center items-center min-h-[calc(100vh-168px)] text-center px-5">
  <div class="w-full max-w-[800px] mx-auto">
    <h1 class="font-bold text-[36px] md:text-[48px] lg:text-[64px] mt-0 mb-[40px] text-white leading-[1.4]">
      Hi!✋ <br /> I'm Nathan Rogers a Robotics/Hardware engineer
    </h1>
    
    <div class="flex justify-center items-center gap-10 mt-[40px]">
      <!-- Email icon with tooltip -->
      <div class="w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex items-center justify-center">
        <Tooltip tooltip="Email me">
          <button
            class="text-white hover:text-[#ca3c25] transition-colors w-full h-full"
            on:click={() => modalOpened.set(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
              <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
            </svg>
          </button>
        </Tooltip>
      </div>

      <!-- GitHub icon with tooltip -->
      <div class="w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex items-center justify-center">
        <Tooltip tooltip="GitHub">
          <a
            href="https://github.com/torn8to"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:text-[#ca3c25] transition-colors w-full h-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>
        </Tooltip>
      </div>

      <!-- LinkedIn icon with tooltip -->
      <div class="w-[50px] h-[50px] md:w-[60px] md:h-[60px] flex items-center justify-center">
        <Tooltip tooltip="LinkedIn">
          <a
            href="https://www.linkedin.com/"
            aria-label="LinkedIn"
            target="_blank"
            rel="noopener noreferrer"
            class="text-white hover:text-[#ca3c25] transition-colors w-full h-full"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
          </a>
        </Tooltip>
      </div>
    </div>
  </div>
</main>
