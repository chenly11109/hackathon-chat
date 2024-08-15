import { createJsonErrorResponseHandler } from '@ai-sdk/provider-utils';
import { z } from 'zod';

const difyErrorDataSchema = z.object({
    object: z.literal('error'),
    message: z.string(),
    type: z.string(),
    param: z.string().nullable(),
    code: z.string().nullable(),
});

export type MistralErrorData = z.infer<typeof difyErrorDataSchema>;

export const difyFailedResponseHandler = createJsonErrorResponseHandler({
    errorSchema: difyErrorDataSchema,
    errorToMessage: data => data.message,
});