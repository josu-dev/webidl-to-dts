<script lang="ts">
  import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { DEFAULT_THEME, REPOSITORY } from '$lib/constants.js';
  import * as Icons from '$lib/icons/index.js';
  import { ModeWatcher } from 'mode-watcher';
  import '../app.css';

  let { children } = $props();

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
    },
    {
      label: 'Shiki',
      url: 'https://shiki.style/',
      icon_url: 'https://shiki.style/logo.svg'
    }
  ];
</script>

<ModeWatcher defaultMode={DEFAULT_THEME} />

<Toaster richColors />

<div class="grid h-screen w-full overflow-hidden">
  <div class="flex flex-col">
    <header
      class="sticky top-0 z-10 flex h-[--site-header-height] items-center gap-1 border-b bg-background px-4"
    >
      <div class="flex items-center gap-1.5">
        <Button variant="ghost" size="icon" aria-label="Home">
          <img src="/logo/icon_filled.svg" alt="Svelte logo" class="size-4/5 dark:invert" />
        </Button>
        <h1 class="sr-only text-xl font-semibold sm:not-sr-only">Web IDL to d.ts</h1>
      </div>

      <nav class="ml-auto flex sm:gap-1.5">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button
              builders={[builder]}
              variant="ghost"
              size="icon"
              title="Thanks list"
              class="lg:hidden"
            >
              <Icons.Blocks class="h-5 w-5" />
              <span class="sr-only">Toggle thanks list</span>
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content align="end" class="text-sm lg:hidden">
            <div class="relative flex select-none items-center rounded-sm px-2 py-1.5">
              <span class="mx-auto py-0.5 font-medium">Made with 📦</span>
            </div>
            {#each thanks_list as { label, url, icon_url, icon_class }}
              <DropdownMenu.Item
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                class="cursor-pointer"
              >
                <img src={icon_url} alt="{label} icon" class="mr-2 h-5 w-5 {icon_class ?? ''}" />
                <span>{label}</span>
              </DropdownMenu.Item>
            {/each}
            <div class="relative flex select-none items-center rounded-sm px-2 py-1.5">
              <span class="mx-auto">and ❤️</span>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>

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

    <footer
      class="hidden h-[--site-footer-height] items-center justify-center border-t bg-background p-2 text-sm lg:flex"
    >
      <span>Made with</span>
      {#each thanks_list as { label, url, icon_url, icon_class }}
        <Button
          variant="link"
          size="sm"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          class="px-2"
        >
          <img src={icon_url} alt="{label} icon" class="mr-2 size-5 {icon_class ?? ''}" />
          <span class="sr-only md:not-sr-only">{label}</span>
        </Button>
      {/each}
      <span>and ❤️</span>
    </footer>
  </div>
</div>
