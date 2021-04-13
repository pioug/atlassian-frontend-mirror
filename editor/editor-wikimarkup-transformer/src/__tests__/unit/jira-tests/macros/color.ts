import {
  code,
  doc,
  p,
  textColor,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParseEncodeRoundTrips } from '../../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe.skip('WikiMarkup Transformer', () => {
  describe('color with noformat', () => {
    const WIKI_NOTATION = `{color:red}This text is in red and {noformat}this part is *preformatted* as well{noformat}.{color}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(
          textColor({ color: '#FF0000' })('This text is in red and '),
          code('this part is *preformatted* as well'),
          textColor({ color: '#FF0000' })('.'),
        ),
      ),
    );
  });

  describe('color between noformat', () => {
    const WIKI_NOTATION = `{{blah}}

{color:red}Note{color}

{{blah}}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p(code('blah')),
        p(textColor({ color: '#FF0000' })('Note')),
        p(code('blah')),
      ),
    );
  });

  describe('color between invalid macros', () => {
    const WIKI_NOTATION = `{invalidmacro}

{color:red}Note{color}

{invalidmacro}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        p('{invalidmacro}'),
        p(textColor({ color: '#FF0000' })('Note')),
        p('{invalidmacro}'),
      ),
    );
  });
});
