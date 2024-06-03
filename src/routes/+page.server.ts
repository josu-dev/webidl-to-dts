import { idl_to_dts_schema } from '$lib/schemas/index.js';
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

        let generated_dts = '';
        try {
            generated_dts = await convert(form.data.raw_idl);
        } catch (exc) {
            console.error(exc);
            if (exc instanceof Error) {
                if (exc.name === 'WebIDLParseError') {
                    return message(form, { error: exc.message }, { status: 400 });
                }
                if (exc.message.toLowerCase().includes('unsupported idl')) {
                    return message(form, { error: exc.message }, { status: 400 });
                }
            }

            return message(
                form,
                { error: 'An error occurred while converting the IDL to TypeScript.' },
                { status: 500 }
            );
        }

        return message(form, { dts: generated_dts });
    }
} satisfies Actions;

const test_example = `
dictionary CookieStoreGetOptions {
  USVString name;
  USVString url;
};

enum CookieSameSite {
  "strict",
  "lax",
  "none"
};
`;
