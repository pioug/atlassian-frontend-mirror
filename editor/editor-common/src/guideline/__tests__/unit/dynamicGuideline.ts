import { ExtendedMediaAttributes } from '@atlaskit/adf-schema';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { generateDynamicGuidelines } from '../../dynamicGuideline';

describe('dynamicGuideline', () => {
  const defaultMediaNode = media({
    id: 'testId',
    type: 'file',
    collection: 'test_collection',
    __fileMimeType: 'image/png',
  })();

  const guidelineConfig = (key: string, xPosition: number) => {
    return { key, position: { x: xPosition }, show: true, style: 'dashed' };
  };

  test.each<[string, ExtendedMediaAttributes, Object[]]>([
    [
      'align-start with pixel width',
      { layout: 'align-start', width: 200, widthType: 'pixel' },
      [guidelineConfig('media_0', -180)],
    ],
    [
      'align-start with percentage width',
      { layout: 'align-start', width: 25, widthType: 'percentage' },
      [guidelineConfig('media_0', -190)],
    ],

    [
      'wrap-left with pixel width',
      { layout: 'wrap-left', width: 200, widthType: 'pixel' },
      [guidelineConfig('media_0', -180)],
    ],
    [
      'wrap-left with percentage width',
      { layout: 'wrap-left', width: 25, widthType: 'percentage' },
      [guidelineConfig('media_0', -190)],
    ],

    [
      'align-end with pixel width',
      { layout: 'align-end', width: 200, widthType: 'pixel' },
      [guidelineConfig('media_0', 180)],
    ],
    [
      'align-end with percentage width',
      { layout: 'align-end', width: 25, widthType: 'percentage' },
      [guidelineConfig('media_0', 190)],
    ],

    [
      'wrap-right with pixel width',
      { layout: 'wrap-right', width: 200, widthType: 'pixel' },
      [guidelineConfig('media_0', 180)],
    ],
    [
      'wrap-right with percentage width',
      { layout: 'wrap-right', width: 25, widthType: 'percentage' },
      [guidelineConfig('media_0', 190)],
    ],

    [
      'center with pixel width',
      { layout: 'center', width: 300, widthType: 'pixel' },
      [
        guidelineConfig('media_0_right', 150),
        guidelineConfig('media_0_left', -150),
      ],
    ],
    [
      'center with percentage width',
      { layout: 'center', width: 50, widthType: 'percentage' },
      [
        guidelineConfig('media_0_right', 190),
        guidelineConfig('media_0_left', -190),
      ],
    ],

    ['center layout', { layout: 'wide', width: 300, widthType: 'pixel' }, []],
    [
      'full-width layout',
      { layout: 'full-width', width: 50, widthType: 'percentage' },
      [],
    ],
  ])(
    `should return correct guideline configs for %s`,
    (_description, attrs, result) => {
      const state = createEditorState(
        doc(mediaSingle(attrs)(defaultMediaNode)),
      );
      const guidelines = generateDynamicGuidelines(state, 760);

      expect(guidelines.length).toEqual(result.length);

      result.forEach((guideline) => {
        expect(guidelines).toEqual(
          expect.arrayContaining([expect.objectContaining(guideline)]),
        );
      });
    },
  );

  it('should return correct guideline configs', () => {
    const state = createEditorState(
      doc(
        p('align-start with pixel width'),
        mediaSingle({ layout: 'align-start', width: 200, widthType: 'pixel' })(
          defaultMediaNode,
        ),
        p('align-end with pixel width'),
        mediaSingle({ layout: 'align-end', width: 200, widthType: 'pixel' })(
          defaultMediaNode,
        ),
        p('align-end with percentage width'),
        mediaSingle({ layout: 'align-end', width: 25 })(defaultMediaNode),
        p('selected media node will be ignored'),
        '{<node>}',
        '{nodeStart}',
        mediaSingle({ layout: 'align-end', width: 25 })(defaultMediaNode),
        '{nodeEnd}',
        p('center layout'),
        mediaSingle({ layout: 'center', width: 300, widthType: 'pixel' })(
          defaultMediaNode,
        ),
        p('center layout with percentage width'),
        mediaSingle({ layout: 'center', width: 50, widthType: 'percentage' })(
          defaultMediaNode,
        ),
        p('full-width will be ignored'),
        mediaSingle({ layout: 'full-width', width: 300, widthType: 'pixel' })(
          defaultMediaNode,
        ),
      ),
    );

    const guidelines = generateDynamicGuidelines(state, 760);
    expect(guidelines).toEqual([
      { key: 'media_0', position: { x: -180 }, show: true, style: 'dashed' },
      {
        key: 'media_1',
        position: {
          x: 180,
        },
        show: true,
        style: 'dashed',
      },
      {
        key: 'media_2',
        position: {
          x: 190,
        },
        show: true,
        style: 'dashed',
      },
      {
        key: 'media_4_right',
        position: {
          x: 150,
        },
        show: true,
        style: 'dashed',
      },
      {
        key: 'media_4_left',
        position: {
          x: -150,
        },
        show: true,
        style: 'dashed',
      },
      {
        key: 'media_5_right',
        position: {
          x: 190,
        },
        show: true,
        style: 'dashed',
      },
      {
        key: 'media_5_left',
        position: {
          x: -190,
        },
        show: true,
        style: 'dashed',
      },
    ]);
  });
});
