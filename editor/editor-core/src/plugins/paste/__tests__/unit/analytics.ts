import { Slice } from 'prosemirror-model';
import {
  doc,
  nestedExpand,
  p,
  table,
  tr,
  td,
} from '@atlaskit/editor-test-helpers/doc-builder';
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { toJSON } from '../../../../utils';
import { getContentNodeTypes } from '../../pm-plugins/analytics';

describe('paste analytics', () => {
  describe('getContentNodeTypes()', () => {
    it('should return node types for a slice contents', () => {
      const json = toJSON(
        doc(p('some text'), p('another text'))(defaultSchema),
      );
      const slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });

      expect(getContentNodeTypes(slice.content).sort()).toEqual([
        'paragraph',
        'text',
      ]);
    });

    it('should return node types for a slice contents with nested nodes', () => {
      const json = toJSON(
        doc(table()(tr(td()(nestedExpand({ title: '' })(p('{<>}'))))))(
          defaultSchema,
        ),
      );
      const slice = Slice.fromJSON(defaultSchema, {
        content: json.content,
        openStart: 1,
        openEnd: 1,
      });

      const expectedNodeTypes = [
        'nestedExpand',
        'paragraph',
        'table',
        'tableCell',
        'tableRow',
      ];
      expect(getContentNodeTypes(slice.content).sort()).toEqual(
        expectedNodeTypes,
      );
    });
  });
});
