import { Slice } from '@atlaskit/editor-prosemirror/model';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  doc,
  nestedExpand,
  p,
  table,
  tr,
  td,
  mediaSingle,
  mediaGroup,
  mediaInline,
  media,
} from '@atlaskit/editor-test-helpers/doc-builder';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import defaultSchema from '@atlaskit/editor-test-helpers/schema';

import { toJSON } from '../../../../utils';
import {
  getContentNodeTypes,
  getMediaTraceId,
} from '../../pm-plugins/analytics';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { temporaryMediaAttrs } from '@atlaskit/editor-test-helpers/media-provider';

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

  describe('getMediaTraceId()', () => {
    const testMediaTraceId = 'test-trace-id';
    const temporaryMedia = media({
      ...temporaryMediaAttrs,
      __mediaTraceId: testMediaTraceId,
    })();

    it('should return mediaTraceId if nested nodes have mediaSingle node', () => {
      const slice = new Slice(
        doc(
          p('some text'),
          mediaSingle()(temporaryMedia),
          p('another text'),
        )(defaultSchema).content,
        1,
        1,
      );

      expect(getMediaTraceId(slice)).toEqual(testMediaTraceId);
    });

    it('should return mediaTraceId if nested nodes have mediaGroup node', () => {
      const slice = new Slice(
        doc(
          p('some text'),
          mediaGroup(temporaryMedia),
          p('another text'),
        )(defaultSchema).content,
        1,
        1,
      );

      expect(getMediaTraceId(slice)).toEqual(testMediaTraceId);
    });

    it('should return mediaTraceId if nested nodes have mediaInline node', () => {
      const slice = new Slice(
        doc(
          p('some text'),
          p(
            mediaInline({
              type: 'file',
              id: 'test-id',
              collection: 'test-collection',
              __mediaTraceId: testMediaTraceId,
            })(),
          ),
          p('another text'),
        )(defaultSchema).content,
        1,
        1,
      );

      expect(getMediaTraceId(slice)).toEqual(testMediaTraceId);
    });
  });
});
