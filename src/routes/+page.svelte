<script lang="ts">
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import IDLToDtsForm from './IDLToDtsForm.svelte';

  let { data } = $props();
  let raw_webidl = $state('');
  let raw_dts = $state('');
</script>

<main class="grid flex-1 gap-4 overflow-auto p-4 md:px-8 lg:grid-cols-2">
  <div class="relative flex-col gap-8">
    <Badge variant="outline" class="absolute right-3 top-3">Web IDL Input</Badge>
    <IDLToDtsForm data={data.form} bind:input={raw_webidl} bind:output={raw_dts} />
  </div>
  <div class="relative flex h-full flex-col rounded-xl bg-muted/50">
    <Badge variant="outline" class="absolute right-3 top-3 z-10">d.ts Output</Badge>
    <div
      class="relative h-full overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
    >
      <Label for="transpilation-output" class="sr-only">Transpiled d.ts definitions</Label>
      <Textarea
        id="transpilation-output"
        class="h-full resize-none border-0 p-3"
        value={raw_dts}
        readonly
      />
    </div>
  </div>
</main>
