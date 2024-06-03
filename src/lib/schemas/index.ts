import { z } from 'zod';

export const idl_to_dts_schema = z.object({
    raw_idl: z.string()
});

export type IDLToDtsSchema = typeof idl_to_dts_schema;
