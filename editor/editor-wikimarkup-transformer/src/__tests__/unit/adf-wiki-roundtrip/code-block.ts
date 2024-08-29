import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import { code_block, doc } from '@atlaskit/editor-test-helpers/doc-builder';

import { adf2wiki, wiki2adf } from '../_test-helpers';

describe('ADF => WikiMarkup => ADF Round-trip - CodeBlock', () => {
	test('should convert codeblock node into code macro', () => {
		adf2wiki(doc(code_block({ language: 'javascript' })('const i = 0;'))(defaultSchema));
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

	test('should convert code macro with language attr into codeblock', () => {
		wiki2adf(`{code:java}package com.atlassian.confluence;
public class CamelCaseLikeClassName {
    private String sampleAttr;
    public static void main(String[] args){
        System.out.print("text");
    };
}{code}`);
	});
});
