<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import * as Icons from '$lib/icons/index.js';
  import { copy_to_clipboard } from '$lib/utils.js';
  import IDLToDtsForm from './IDLToDtsForm.svelte';

  let { data } = $props();
  let raw_webidl = $state('');
  let raw_dts = $state('');
</script>

<SEO
  description="Convert Web IDL to TypeScript definitions powered by the webidl-dts-gen library. Yes there is a tool for transpiling/translating the lovely spec into nice developer-friendly types for a better DX."
/>

<main class="grid flex-1 gap-4 overflow-auto p-4 md:px-8 lg:grid-cols-2">
  <div class="relative">
    <Badge class="absolute right-3 top-3">Web IDL Input</Badge>
    <IDLToDtsForm data={data.form} bind:input={raw_webidl} bind:output={raw_dts} />
  </div>
  <div class="relative">
    <Badge class="absolute right-3 top-3 z-10">d.ts Output</Badge>
    <div
      class="relative h-full overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
    >
      <Label for="transpilation-output" class="sr-only">Transpiled d.ts definitions</Label>
      <Textarea
        id="transpilation-output"
        class="h-full resize-none border-0 p-3 font-mono"
        value={raw_dts}
        readonly
        on:click={copy_to_clipboard({
          text: () => raw_dts
        })}
      />
      <Button size="icon" title="Copy d.ts to clipboard" class="absolute bottom-4 right-4">
        <Icons.Copy class="size-5" />
        <span class="sr-only">Copy d.ts to clipboard</span>
      </Button>
    </div>
  </div>
</main>
