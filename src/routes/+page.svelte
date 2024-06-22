<script lang="ts">
  import SEO from '$lib/components/SEO.svelte';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Form from '$lib/components/ui/form/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { Textarea } from '$lib/components/ui/textarea/index.js';
  import {
    LOCAL_STORAGE_PREFIX,
    TOAST_DURATION_ERROR,
    TOAST_DURATION_SUCCESS
  } from '$lib/constants.js';
  import * as Icons from '$lib/icons/index.js';
  import { idl_to_dts_schema } from '$lib/schemas/index.js';
  import { state_local } from '$lib/state.svelte.js';
  import { untrack } from 'svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  const AUTO_TRANSPILE_DELAY = 2500;
  const IDL_EXAMPLE = false
    ? `dictionary CookieStoreGetOptions {
    USVString name;
    USVString url;
};

enum CookieSameSite {
    "strict",
    "lax",
    "none",
    "unspecified_long_stringggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg"
};
`
    : '';

  let { data } = $props();

  let raw_idl = state_local('idl_input', IDL_EXAMPLE, LOCAL_STORAGE_PREFIX);
  // updates the form initial value with the stored value
  data.form.data.raw_idl = raw_idl.value;
  let last_raw_idl = raw_idl.value;

  let form_el: HTMLFormElement | undefined = $state();
  let dts_snippet_el: HTMLDivElement | undefined = $state();
  let dts_snippet = $state(
    `<pre class="shiki shiki-themes dark-plus light-plus" style="--dark:#D4D4D4;--light:#000000;--dark-bg:#1E1E1E;--light-bg:#FFFFFF" tabindex="0"><code><span class="line"></span>
</code></pre>`
  );

  let copied = false;

  let timeout_id: ReturnType<typeof setTimeout> | undefined;

  const form = superForm(data.form, {
    validators: zodClient(idl_to_dts_schema),
    resetForm: false,
    autoFocusOnError: false,
    multipleSubmits: 'abort',
    onChange(event) {
      const new_source = event.get('raw_idl');
      if (new_source === last_raw_idl) {
        return;
      }

      last_raw_idl = new_source;
      raw_idl.value = new_source;

      clearTimeout(timeout_id);
      timeout_id = setTimeout(() => {
        form_el?.requestSubmit();
      }, AUTO_TRANSPILE_DELAY);
    },
    onUpdated(data) {
      if (!data.form.valid) {
        console.error(data.form);

        let title = data.form.message.error as string;
        let description;

        if (title.includes('error at line')) {
          const first_new_line = title.indexOf('\n');
          if (first_new_line > 0) {
            description = title.slice(first_new_line + 1);
            title = title.slice(0, first_new_line);
          }
        }

        toast.error(title, {
          description: description,
          duration: TOAST_DURATION_ERROR,
          classes: {
            title: 'text-balance',
            description: 'whitespace-pre-wrap font-mono !text-foreground'
          }
        });
        return;
      }

      dts_snippet = data.form.message.dts_highlighted;
      copied = false;
    }
  });

  const { form: formData, enhance } = form;

  $effect(() => {
    const start_dts = untrack(() => $formData.raw_idl);
    if (start_dts.trim().length > 0) {
      form_el?.requestSubmit();
    }
  });

  function copy_dts_code() {
    let text;
    let on_error;
    let on_success;

    const range = window.getSelection();
    const selection_range = range?.rangeCount ? range.getRangeAt(0) : null;
    let selection_text = '';
    if (
      selection_range &&
      (selection_range.commonAncestorContainer === dts_snippet_el ||
        dts_snippet_el?.contains(selection_range.commonAncestorContainer))
    ) {
      selection_text = selection_range.toString();
    }

    if (selection_text.length > 0) {
      text = selection_text;
      on_error = 'Failed to copy selection to clipboard 😢';
      on_success = 'Copied selection to clipboard 😉';
    } else {
      text = dts_snippet_el?.innerText || '';
      on_error = 'Failed to copy to clipboard 😢';
      on_success = 'Copied to clipboard 😉';
    }

    text = text.trim();
    if (text.length === 0) {
      return;
    }
    text = text + '\n';

    copied = true;

    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(on_success, { duration: TOAST_DURATION_SUCCESS });
      },
      (err) => {
        console.error('Failed to copy: ', err);
        toast.error(on_error, { duration: TOAST_DURATION_SUCCESS * 2 });
      }
    );
  }
</script>

<SEO
  description="Convert Web IDL to TypeScript definitions powered by the webidl-dts-gen library. Yes there is a tool for transpiling/translating the lovely spec into nice developer-friendly types for a better DX."
/>

<main
  class="grid h-[--site-main-height] grid-cols-1 grid-rows-2 gap-2 overflow-hidden px-4 py-2 md:px-8 lg:grid-cols-2 lg:grid-rows-1 lg:gap-4 lg:py-4"
>
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
            spellcheck="false"
            class="h-full w-full resize-none whitespace-pre-wrap break-all px-3 py-3 font-mono text-sm"
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
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        id="transpilation-output"
        bind:this={dts_snippet_el}
        onclick={() => {
          if (copied) {
            return;
          }
          copy_dts_code();
        }}
        class="code-container"
      >
        {@html dts_snippet}
      </div>
      <Button
        on:click={copy_dts_code}
        size="icon"
        title="Copy d.ts to clipboard"
        class="absolute bottom-4 right-4"
      >
        <Icons.Copy class="size-5" />
        <span class="sr-only">Copy d.ts to clipboard</span>
      </Button>
    </div>
  </div>
</main>
