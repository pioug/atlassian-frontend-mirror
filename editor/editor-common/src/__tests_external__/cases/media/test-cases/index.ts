import { InProductTestCollection } from '@atlaskit/in-product-testing';

import { addAltTextMediaTestCase } from './alt-text';
import { addCaptionMediaTestCase } from './caption';
import { EditorMediaTestCaseOpts } from './types';
import { uploadMediaTestCase } from './upload';

export const mediaTestCollection = (opts: EditorMediaTestCaseOpts) =>
  new InProductTestCollection({
    title: '@atlaskit/editor-core -> Media, happy paths',
    testCases: [
      uploadMediaTestCase(opts),
      addAltTextMediaTestCase(opts),
      addCaptionMediaTestCase(opts),
    ],
  });
