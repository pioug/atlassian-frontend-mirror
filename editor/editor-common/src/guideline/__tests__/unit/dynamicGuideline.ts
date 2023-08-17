import type { ExtendedMediaAttributes } from '@atlaskit/adf-schema';
import { createEditorState } from '@atlaskit/editor-test-helpers/create-editor-state';
import {
  doc,
  media,
  mediaSingle,
  p,
} from '@atlaskit/editor-test-helpers/doc-builder';

import { generateDynamicGuidelines } from '../../dynamicGuideline';
import type { GuidelineStyles } from '../../types';

describe('dynamicGuideline', () => {
  const defaultMediaNode = media({
    id: 'testId',
    type: 'file',
    width: 1280,
    height: 720,
    collection: 'test_collection',
    __fileMimeType: 'image/png',
  })();

  const defaultStyle: GuidelineStyles = {
    styles: {
      lineStyle: 'dashed',
    },
    show: false,
  };

  const guidelineConfig = (
    key: string,
    xPosition: number,
    styles: GuidelineStyles = defaultStyle,
  ) => {
    return { key, position: { x: xPosition }, ...styles };
  };

  test.each<[string, ExtendedMediaAttributes, Object[], Object]>([
    [
      'align-start with pixel width',
      { layout: 'align-start', width: 200, widthType: 'pixel' },
      [guidelineConfig('media_0', -180)],
      {
        width: { '200': [{}] },
        height: { '112': [{}] },
      },
    ],
    [
      'align-start with percentage width',
      { layout: 'align-start', width: 25, widthType: 'percentage' },
      [],
      {
        width: {},
        height: {},
      },
    ],
    [
      'wrap-left with pixel width',
      { layout: 'wrap-left', width: 200, widthType: 'pixel' },
      [guidelineConfig('media_0', -180)],
      {
        width: { '200': [{}] },
        height: { '112': [{}] },
      },
    ],
    [
      'wrap-left with percentage width',
      { layout: 'wrap-left', width: 25, widthType: 'percentage' },
      [],
      {
        width: {},
        height: {},
      },
    ],
    [
      'align-end with pixel width',
      { layout: 'align-end', width: 200, widthType: 'pixel' },
      [guidelineConfig('media_0', 180)],
      {
        width: { '200': [{}] },
        height: { '112': [{}] },
      },
    ],
    [
      'align-end with percentage width',
      { layout: 'align-end', width: 25, widthType: 'percentage' },
      [],
      {
        width: {},
        height: {},
      },
    ],
    [
      'wrap-right with pixel width',
      { layout: 'wrap-right', width: 200, widthType: 'pixel' },
      [guidelineConfig('media_0', 180)],
      {
        width: { '200': [{}] },
        height: { '112': [{}] },
      },
    ],
    [
      'wrap-right with percentage width',
      { layout: 'wrap-right', width: 25, widthType: 'percentage' },
      [],
      {
        width: {},
        height: {},
      },
    ],
    [
      'center with pixel width',
      { layout: 'center', width: 300, widthType: 'pixel' },
      [
        guidelineConfig('media_0_right', 150),
        guidelineConfig('media_0_left', -150),
      ],
      {
        width: { '300': [{}] },
        height: { '168': [{}] },
      },
    ],
    [
      'center with percentage width',
      { layout: 'center', width: 50, widthType: 'percentage' },
      [],
      {
        width: {},
        height: {},
      },
    ],
    [
      'center layout',
      { layout: 'wide', width: 300, widthType: 'pixel' },
      [],
      {
        width: { '300': [{}] },
        height: { '168': [{}] },
      },
    ],
    [
      'full-width layout',
      { layout: 'full-width', width: 50, widthType: 'percentage' },
      [],
      {
        width: {},
        height: {},
      },
    ],
  ])(
    `should return correct guideline configs for %s`,
    (_description, attrs, result, relativeGuideResult) => {
      const state = createEditorState(
        doc(mediaSingle(attrs)(defaultMediaNode)),
      );

      const { dynamicGuides, relativeGuides } = generateDynamicGuidelines(
        state,
        760,
        defaultStyle,
      );

      expect(relativeGuides).toMatchObject(relativeGuideResult);

      expect(dynamicGuides.length).toEqual(result.length);

      result.forEach((guideline) => {
        expect(dynamicGuides).toEqual(
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

    const { dynamicGuides } = generateDynamicGuidelines(
      state,
      760,
      defaultStyle,
    );
    expect(dynamicGuides).toEqual([
      { key: 'media_0', position: { x: -180 }, ...defaultStyle },
      {
        key: 'media_1',
        position: {
          x: 180,
        },
        ...defaultStyle,
      },
      {
        key: 'media_4_right',
        position: {
          x: 150,
        },
        ...defaultStyle,
      },
      {
        key: 'media_4_left',
        position: {
          x: -150,
        },
        ...defaultStyle,
      },
    ]);
  });
});
