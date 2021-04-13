import {
  doc,
  p,
  table,
  tr,
  th,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import { createJIRASchema } from '@atlaskit/adf-schema';
import { checkParseEncodeRoundTrips } from './_test-helpers';

const schema = createJIRASchema({ allowTables: true });

describe('JIRATransformer', () => {
  describe('table', () => {
    checkParseEncodeRoundTrips(
      'with header column',
      schema,
      `<table class="confluenceTable"><tbody><tr><th class="confluenceTh"><p>one</p></th><td class="confluenceTd"><p>1</p></td><td class="confluenceTd"><p>2</p></td></tr><tr><th class="confluenceTh"><p>two</p></th><td class="confluenceTd"><p>3</p></td><td class="confluenceTd"><p>4</p></td></tr></tbody></table>`,
      doc(
        table()(
          tr(th({})(p('one')), td({})(p('1')), td({})(p('2'))),
          tr(th({})(p('two')), td({})(p('3')), td({})(p('4'))),
        ),
      ),
    );

    checkParseEncodeRoundTrips(
      'with header row',
      schema,
      `<table class="confluenceTable"><tbody><tr><th class="confluenceTh"><p>one</p></th><th class="confluenceTh"><p>two</p></th><th class="confluenceTh"><p>three</p></th></tr><tr><td class="confluenceTd"><p>1</p></td><td class="confluenceTd"><p>2</p></td><td class="confluenceTd"><p>3</p></td></tr></tbody></table>`,
      doc(
        table()(
          tr(th({})(p('one')), th({})(p('two')), th({})(p('three'))),
          tr(td({})(p('1')), td({})(p('2')), td({})(p('3'))),
        ),
      ),
    );

    checkParseEncodeRoundTrips(
      'with header row and header column',
      schema,
      `<table class="confluenceTable"><tbody><tr><th class="confluenceTh"><p>one</p></th><th class="confluenceTh"><p>two</p></th><th class="confluenceTh"><p>three</p></th></tr><tr><th class="confluenceTh"><p>four</p></th><td class="confluenceTd"><p>1</p></td><td class="confluenceTd"><p>2</p></td></tr></tbody></table>`,
      doc(
        table()(
          tr(th({})(p('one')), th({})(p('two')), th({})(p('three'))),
          tr(th({})(p('four')), td({})(p('1')), td({})(p('2'))),
        ),
      ),
    );
  });
});
