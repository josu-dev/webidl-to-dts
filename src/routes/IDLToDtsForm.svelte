<script lang="ts">
  import * as Form from '$lib/components/ui/form';
  import Textarea from '$lib/components/ui/textarea/textarea.svelte';
  import * as Icon from '$lib/icons/index.js';
  import type { IDLToDtsSchema } from '$lib/schemas/index';
  import { idl_to_dts_schema } from '$lib/schemas/index';
  import type { Infer, SuperValidated } from 'sveltekit-superforms';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';

  type Props = {
    data: SuperValidated<Infer<IDLToDtsSchema>>;
    input?: string;
    output?: string;
    el?: HTMLFormElement;
  };

  let {
    data,
    input = $bindable(''),
    output = $bindable(''),
    el: form_el = $bindable()
  }: Props = $props();

  let timeout_id: ReturnType<typeof setTimeout> | undefined;

  const form = superForm(data, {
    validators: zodClient(idl_to_dts_schema),
    resetForm: false,
    onChange(event) {
      clearTimeout(timeout_id);
      input = event.get('raw_idl');
      timeout_id = setTimeout(() => {
        form_el?.requestSubmit();
      }, 1000);
    },
    onUpdated: (data) => {
      if (data.form.valid) {
        output = data.form.message.dts;
      } else {
        console.error(data);
      }
    }
  });

  const { form: formData, enhance } = form;
</script>

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
      <Textarea {...attrs} bind:value={$formData.raw_idl} class="h-full w-full resize-none" />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
  <Form.Button size="icon" title="Transpile" class="absolute bottom-4 right-4">
    <Icon.ArrowRightFromLine class="size-5" />
    <span class="sr-only">Transpile</span>
  </Form.Button>
</form>
