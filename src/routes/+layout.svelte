<script lang="ts">
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { DEFAULT_THEME, REPOSITORY } from '$lib/constants.js';
  import * as Icon from '$lib/icons/index.js';
  import { ModeWatcher } from 'mode-watcher';
  import '../app.css';

  let { data, children } = $props();

  const thanks_list = [
    {
      label: 'Svelte',
      url: 'https://svelte.dev/',
      icon_url: 'https://svelte.dev/favicon.png'
    },
    {
      label: 'Shadcn',
      url: 'https://www.shadcn-svelte.com/',
      icon_url: 'https://www.shadcn-svelte.com/favicon.ico'
    },
    {
      label: 'webidl-dts-gen',
      url: 'https://github.com/pmndrs/webidl-dts-gen',
      icon_url: 'https://github.com/favicon.ico',
      icon_class: 'dark:invert'
    }
  ];
</script>

<ModeWatcher defaultMode={DEFAULT_THEME} />

<div class="grid h-screen w-full">
  <div class="flex flex-col">
    <header class="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <div class="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" aria-label="Home">
          <Icon.Languages class="size-5 fill-foreground" />
        </Button>
        <h1 class="sr-only text-xl font-semibold sm:not-sr-only">Web IDL to d.ts</h1>
      </div>

      <nav class="ml-auto flex gap-1.5">
        <Button
          variant="ghost"
          href="https://webidl.spec.whatwg.org/"
          target="_blank"
          rel="noopener noreferrer"
          size="icon"
          title="Web IDL specification"
          class="gap-1.5 text-sm"
        >
          <img
            src="https://resources.whatwg.org/logo-webidl.svg"
            alt="Web IDL logo"
            class="size-5"
          />
          <span class="sr-only">Web IDL specification</span>
        </Button>
        <Button
          variant="ghost"
          href={REPOSITORY}
          target="_blank"
          rel="noopener noreferrer"
          size="icon"
          title="Github repository"
          class="gap-1.5 text-sm"
        >
          <img src="/icon/github-mark.svg" alt="Github logo" class="size-5 dark:invert" />
          <span class="sr-only">Github repository</span>
        </Button>
        <ThemeSwitcher />
      </nav>
    </header>
    {@render children()}
    <footer class="flex items-center justify-center border-t bg-background p-2">
      <span class="text-sm">Made with</span>
      {#each thanks_list as { label, url, icon_url, icon_class }}
        <Button
          variant="link"
          size="sm"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          class="px-2"
        >
          <img src={icon_url} alt="{label} icon" class="size-5 md:mr-2 {icon_class ?? ''}" />
          <span class="sr-only text-sm md:not-sr-only">{label}</span>
        </Button>
      {/each}
      <span class="text-sm">and ❤️</span>
    </footer>
  </div>
</div>
