import type { InProductCommonTestCaseOpts } from '@atlaskit/in-product-testing';

export interface EditorTestCaseOpts extends InProductCommonTestCaseOpts {
  ui?: {
    /* DOM selector of the publish button */
    publishButton?: string;
  };

  runOnly?: string[];
}
