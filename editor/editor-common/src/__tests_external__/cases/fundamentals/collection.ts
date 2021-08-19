import { InProductTestCollection } from '@atlaskit/in-product-testing';

import { EditorTestCaseOpts } from '../types';

import { editorIsPresentTestCase } from './test-cases/editor-is-present';
import { editorTypingTestCase } from './test-cases/editor-typing';

export const fundamentalsTestCollection = (opts: EditorTestCaseOpts) =>
  new InProductTestCollection({
    title: '@atlaskit/editor-core -> Editor fundamentals happy path tests',
    testCases: [editorIsPresentTestCase(opts), editorTypingTestCase(opts)],
  });
