/**
 * In order to enable mentions in Editor we must set both properties: allowMentions and mentionProvider.
 * So this type is supposed to be a stub version of mention provider. We don't actually need it.
 */
import { MentionResource } from '@atlaskit/mention/resource';
import { createPromise } from '../cross-platform-promise';

export async function createMentionProvider() {
  try {
    const accountIdResponse = await createPromise('getAccountId').submit();
    const accountId = selectAccountId(accountIdResponse);

    return new MentionResource({
      // Required attrib. Requests will happen natively.
      url: 'http://',
      shouldHighlightMention: (mention) => accountId === mention.id,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      `Could not construct a MentionProvider, the following exception occurred:`,
      err,
    );
    return new MentionResource({ url: 'http://' });
  }
}

function selectAccountId(input: unknown): string {
  const hasAccountId = (input: object): input is { accountId: unknown } =>
    input.hasOwnProperty('accountId');

  switch (typeof input) {
    case 'string':
      return input;

    case 'object':
      if (
        input !== null &&
        hasAccountId(input) &&
        typeof input.accountId === 'string'
      ) {
        return input.accountId;
      }
  }

  throw new Error(
    `Could not select accountId, string | { acountId: string } required but received ${JSON.stringify(
      input,
    )}`,
  );
}
