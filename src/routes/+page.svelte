<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import * as Icons from '$lib/icons/index.js';
  import { idl_to_dts_schema } from '$lib/schemas/index.js';
  import { copy_to_clipboard } from '$lib/utils.js';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  let { data } = $props();

  let raw_idl = $state('');
  let raw_dts = $state('');
  let timeout_id: ReturnType<typeof setTimeout> | undefined;
  let form_el: HTMLFormElement | undefined = $state();

  const form = superForm(data.form, {
    validators: zodClient(idl_to_dts_schema),
    resetForm: false,
    onChange(event) {
      clearTimeout(timeout_id);
      raw_idl = event.get('raw_idl');
      timeout_id = setTimeout(() => {
        form_el?.requestSubmit();
      }, 500);
    },
    onUpdated: (data) => {
      if (data.form.valid) {
        raw_dts = data.form.message.dts;
      } else {
        console.error(data);
      }
    }
  });

  const { form: formData, enhance } = form;
</script>

<SEO
  description="Convert Web IDL to TypeScript definitions powered by the webidl-dts-gen library. Yes there is a tool for transpiling/translating the lovely spec into nice developer-friendly types for a better DX."
/>

<main class="grid flex-1 gap-4 overflow-auto p-4 md:px-8 lg:grid-cols-2">
  <div class="relative">
    <Badge class="absolute right-3 top-3">Web IDL Input</Badge>
    <form
      action="?/idl_to_dts"
      method="POST"
      use:enhance
      bind:this={form_el}
      class="grid h-full w-full"
    >
      <Form.Field {form} name="raw_idl" class="space-y-0">
        <Form.Control let:attrs>
          <Form.Label class="sr-only">Source Web IDL definitions</Form.Label>
          <Textarea
            {...attrs}
            bind:value={$formData.raw_idl}
            class="h-full w-full resize-none font-mono"
          />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Button size="icon" title="Transpile" class="absolute bottom-4 right-4">
        <Icons.ArrowRightFromLine class="hidden size-5 lg:block" />
        <Icons.ArrowDownFromLine class="size-5 lg:hidden" />
        <span class="sr-only">Transpile</span>
      </Form.Button>
    </form>
  </div>

  <div class="relative">
    <Badge class="absolute right-3 top-3 z-10">d.ts Output</Badge>
    <div
      class="relative h-full overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
    >
      <Label for="transpilation-output" class="sr-only">Transpiled d.ts definitions</Label>
      <Textarea
        id="transpilation-output"
        value={raw_dts}
        readonly
        on:click={copy_to_clipboard({
          text: () => raw_dts
        })}
        class="h-full resize-none border-0 p-3 font-mono"
      />
      <Button size="icon" title="Copy d.ts to clipboard" class="absolute bottom-4 right-4">
        <Icons.Copy class="size-5" />
        <span class="sr-only">Copy d.ts to clipboard</span>
      </Button>
    </div>
  </div>
</main>
