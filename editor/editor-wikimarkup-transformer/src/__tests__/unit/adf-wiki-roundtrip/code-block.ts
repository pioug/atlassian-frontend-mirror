import { defaultSchema } from '@atlaskit/adf-schema';
import { adf2wiki, wiki2adf } from '../_test-helpers';

import { code_block, doc } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup => ADF - CodeBlock', () => {
  test('should convert code block node into code macro', () => {
    adf2wiki(
      doc(code_block({ language: 'javascript' })('const i = 0;'))(
        defaultSchema,
      ),
    );
    adf2wiki(
      doc(
        code_block({ language: 'java' })(`package com.atlassian.confluence;
public class CamelCaseLikeClassName {
    private String sampleAttr;
    public static void main(String[] args){
        System.out.print("text");
    };
}`),
      )(defaultSchema),
    );
  });

  test('should convert code macro with language attr into code block', () => {
    wiki2adf(`{code:java}package com.atlassian.confluence;
public class CamelCaseLikeClassName {
    private String sampleAttr;
    public static void main(String[] args){
        System.out.print("text");
    };
}{code}`);
  });
});
