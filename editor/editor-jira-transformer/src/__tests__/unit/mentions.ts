import { doc, p, mention } from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from './_test-helpers';
import { createJIRASchema } from '@atlaskit/adf-schema';

const schema = createJIRASchema({ allowMentions: true });
const mentionEncoder = (userId: string) => `/secure/ViewProfile?name=${userId}`;

describe('JIRATransformer', () => {
  describe('mentions', () => {
    checkParseEncodeRoundTrips(
      'mention node',
      schema,
      `<p>Text <a class="user-hover" href="/secure/ViewProfile?name=Starr" rel="Starr">@Cheryll Maust</a> text</p>`,
      doc(
        p('Text ', mention({ id: 'Starr', text: '@Cheryll Maust' })(), ' text'),
      ),
      { mention: mentionEncoder },
    );
  });
});
