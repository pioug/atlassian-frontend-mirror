import { Fragment, Slice } from 'prosemirror-model';

import defaultSchema from '@atlaskit/editor-test-helpers/schema';
import {
  decisionItem,
  decisionList,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { transformSliceToDecisionList } from '../../utils';

const fragment = (...args: any) =>
  Fragment.from(args.map((i: any) => i(defaultSchema)));

describe('tasks and decisions - utils', () => {
  describe('copy-pasting decisions', () => {
    describe('transformSliceToDecisionList', () => {
      it('should wrap decisionItem with decisionList', () => {
        const slice = new Slice(
          fragment(decisionItem()('decision content')),
          0,
          0,
        );
        const expectedSlice = new Slice(
          fragment(decisionList()(decisionItem()('decision content'))),
          0,
          0,
        );
        expect(
          transformSliceToDecisionList(slice, defaultSchema).eq(expectedSlice),
        ).toBeTruthy();
      });
    });
  });
});
