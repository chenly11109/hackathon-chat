export type DifyChatModelId =
    | 'open-mistral-7b'
    | 'open-mixtral-8x7b'
    | 'open-mixtral-8x22b'
    | 'mistral-small-latest'
    | 'mistral-medium-latest'
    | 'mistral-large-latest'
    | (string & {});

export interface DifyChatSettings {
    /**
  Whether to inject a safety prompt before all conversations.
  
  Defaults to `false`.
     */
    safePrompt?: boolean;
}