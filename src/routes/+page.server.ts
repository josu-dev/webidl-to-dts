import { idl_to_dts_schema } from '$lib/schemas/index.js';
import { highlightTypescript } from '$lib/shiki';
import { fail, message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { convert } from 'webidl-dts-gen';
import type { Actions, PageServerLoad } from './$types';

export const load = (async () => {
    const form = await superValidate(zod(idl_to_dts_schema));

    return {
        form: form
    };
}) satisfies PageServerLoad;

export const actions = {
    idl_to_dts: async ({ request }) => {
        const form = await superValidate(request, zod(idl_to_dts_schema));
        if (!form.valid) {
            return fail(400, { form });
        }

        let transpiled_dts: string;
        try {
            transpiled_dts = await convert(form.data.raw_idl);
        } catch (exc) {
            if (exc instanceof Error) {
                if (exc.name === 'WebIDLParseError') {
                    return message(form, { error: exc.message }, { status: 400 });
                }
                if (exc.message.toLowerCase().includes('unsupported idl')) {
                    return message(form, { error: exc.message }, { status: 400 });
                }
            }

            console.error(exc);

            return message(
                form,
                { error: 'An error occurred while converting the IDL to TypeScript.' },
                { status: 500 }
            );
        }

        // prettify the output
        transpiled_dts =
            transpiled_dts
                .replace(/([;}])\n+(type|interface|declare)/g, '$1\n\n$2') // Ensures two newlines between top-level declarations
                .replace(/{\s+}/g, '{}') // Removes whitespace between empty object literals
                .trim() + '\n';

        const result = {
            // dts: transpiled_dts,
            dts_highlighted: await highlightTypescript(transpiled_dts)
        };

        return message(form, result);
    }
} satisfies Actions;
