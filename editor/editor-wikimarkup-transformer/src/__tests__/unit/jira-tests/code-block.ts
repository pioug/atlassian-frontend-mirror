import { doc, code_block } from '@atlaskit/editor-test-helpers/doc-builder';
import { checkParse, checkParseEncodeRoundTrips } from '../_test-helpers';
import { defaultSchema } from '@atlaskit/adf-schema';

// Nodes

describe('WikiMarkup Transformer', () => {
  describe('camelcase code macro', () => {
    const WIKI_NOTATION = `{code}package com.atlassian.confluence;
public class CamelCaseLikeClassName
{
private String sampleAttr;
}{code}`;

    checkParseEncodeRoundTrips(
      WIKI_NOTATION,
      defaultSchema,
      WIKI_NOTATION,
      doc(
        code_block({ language: 'java' })(
          'package com.atlassian.confluence;\n' +
            'public class CamelCaseLikeClassName\n' +
            '{\n' +
            'private String sampleAttr;\n' +
            '}',
        ),
      ),
    );
  });

  describe('code macro XSS', () => {
    const WIKI_NOTATION = `{code:lang=java"</pre><script>alert('not good')</script>}some code{code}`;

    checkParse(
      WIKI_NOTATION,
      defaultSchema,
      [WIKI_NOTATION],
      doc(
        code_block({ language: 'java' })(
          // @TODO Does it need the error?
          // https://stash.atlassian.com/projects/JIRACLOUD/repos/jira/browse/jira-components/jira-renderer/src/test/resources/render-tests/code-macro-render-tests.properties
          'some code',
        ),
      ),
    );
  });
});
