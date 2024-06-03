<script lang="ts">
  import { Button } from '$lib/components/ui/button/index.js';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
  import * as Icons from '$lib/icons/index.js';
  import { resetMode, setMode, userPrefersMode } from 'mode-watcher';
</script>

<DropdownMenu.Root>
  <DropdownMenu.Trigger asChild let:builder>
    <Button builders={[builder]} variant="ghost" size="icon" title="Switch theme">
      <Icons.Sun class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Icons.Moon
        class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="end">
    <DropdownMenu.Item
      disabled={$userPrefersMode === 'dark'}
      data-highlighted={$userPrefersMode === 'dark' ? '' : undefined}
      on:click={() => setMode('dark')}
      class="cursor-pointer data-[highlighted]:bg-accent/80 data-[disabled]:opacity-100"
    >
      <Icons.Moon class="mr-2 h-4 w-4" />
      <span>Dark</span>
    </DropdownMenu.Item>
    <DropdownMenu.Item
      disabled={$userPrefersMode === 'light'}
      data-highlighted={$userPrefersMode === 'light' ? '' : undefined}
      on:click={() => setMode('light')}
      class="cursor-pointer data-[highlighted]:bg-accent/80 data-[disabled]:opacity-100"
    >
      <Icons.Sun class="mr-2 h-4 w-4" />
      <span>Light</span>
    </DropdownMenu.Item>
    <DropdownMenu.Item
      disabled={$userPrefersMode === 'system'}
      data-highlighted={$userPrefersMode === 'system' ? '' : undefined}
      on:click={() => resetMode()}
      class="cursor-pointer data-[highlighted]:bg-accent/80 data-[disabled]:opacity-100"
    >
      <Icons.PcCase class="mr-2 h-4 w-4" />
      <span>System</span>
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu.Root>
