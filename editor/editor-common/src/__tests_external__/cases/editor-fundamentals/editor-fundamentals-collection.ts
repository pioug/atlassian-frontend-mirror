import { EditorTestCollection } from '../base-test-collection';
import { TestCaseOpts } from '../types';

import { editorIsPresentTestCase } from './test-cases/editor-is-present';
import { editorTypingTestCase } from './test-cases/editor-typing';

export const editorFundamentalsTestCollection = (opts: TestCaseOpts) =>
  new EditorTestCollection({
    title: '@atlaskit/editor-core -> Editor fundamentals happy path tests',
    testCases: [editorIsPresentTestCase(opts), editorTypingTestCase(opts)],
  });
