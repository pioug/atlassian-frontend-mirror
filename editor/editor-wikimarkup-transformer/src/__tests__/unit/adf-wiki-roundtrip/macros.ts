import { defaultSchema } from '@atlaskit/adf-schema';
import { adf2wiki, wiki2adf } from '../_test-helpers';

import { code_block, doc } from '@atlaskit/editor-test-helpers';

describe('ADF => WikiMarkup => ADF - Macros', () => {
  test('should convert code block node with no language attr into noformat macro', () => {
    adf2wiki(
      doc(
        code_block({})(`package com.atlassian.confluence;
public class CamelCaseLikeClassName {
    private String sampleAttr;
    public static void main(String[] args){
        System.out.print("text");
    };
}`),
      )(defaultSchema),
    );
  });

  test('should convert noformat macro into code block and back', () => {
    wiki2adf(`{noformat}package com.atlassian.confluence;
public class CamelCaseLikeClassName {
    private String sampleAttr;
    public static void main(String[] args){
        System.out.print("text");
    };
}{noformat}`);
  });
});
