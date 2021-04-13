import { doc, p, a } from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from './_test-helpers';
import { createJIRASchema } from '@atlaskit/adf-schema';

const schema = createJIRASchema({ allowLinks: true });

describe('JIRATransformer', () => {
  describe('links', () => {
    checkParseEncodeRoundTrips(
      'external link',
      schema,
      `<p>Text <a class="external-link" rel="nofollow" href="https://atlassian.com">atlassian.com</a> text</p>`,
      doc(
        p(
          'Text ',
          a({ href: 'https://atlassian.com' })('atlassian.com'),
          ' text',
        ),
      ),
    );

    checkParseEncodeRoundTrips(
      'mailto link',
      schema,
      `<p>Text <a class="external-link" rel="nofollow" href="mailto:me@atlassian.com">me@atlassian.com</a> text</p>`,
      doc(
        p(
          'Text ',
          a({ href: 'mailto:me@atlassian.com' })('me@atlassian.com'),
          ' text',
        ),
      ),
    );

    checkParseEncodeRoundTrips(
      'anchor',
      schema,
      `<p>Text <a href="#hash">some anchor</a> text</p>`,
      doc(p('Text ', a({ href: '#hash' })('some anchor'), ' text')),
    );
  });
});
