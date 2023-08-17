import { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

import { generateDefaultGuidelines } from '../../defaultGuideline';
import type { GuidelineConfig } from '../../types';
import {
  getContainerWidthOrFullEditorWidth,
  getGuidelineTypeFromKey,
  getMediaSingleDimensions,
} from '../../utils';

type JsonObject = {
  [key: string]: any;
};

const mediaSingleNode = (
  originalWidth: number,
  originalHeight: number,
  width?: number,
  widthType: string = 'percentage',
  layout: string = 'center',
) => {
  return {
    type: 'mediaSingle',
    attrs: {
      layout,
      width,
      widthType,
    },
    content: [
      {
        type: 'media',
        attrs: {
          type: 'file',
          id: 'a559980d-cd47-43e2-8377-27359fcb905f',
          collection: 'MediaServicesSample',
          width: originalWidth,
          height: originalHeight,
        },
        marks: [],
      },
    ],
  };
};

describe('utils', () => {
  const defaultSchema = getSchemaBasedOnStage('stage0');

  describe('#getContainerWidthOrFullEditorWidth', () => {
    it('should return expected width', () => {
      const containerWidth = 1200;
      const expectedWidth = 568;

      const result = getContainerWidthOrFullEditorWidth(containerWidth);
      expect(result).toEqual(expectedWidth);
    });
  });

  describe('#getMediaSingleDimensions', () => {
    test.each<[JsonObject, JsonObject]>([
      [
        mediaSingleNode(100, 100, 200, 'pixel'),
        {
          height: 200,
          originalHeight: 100,
          originalWidth: 100,
          ratio: 1,
          width: 200,
        },
      ],
      [
        mediaSingleNode(1920, 1080, 350, 'pixel'),
        {
          height: 196,
          width: 350,
          originalHeight: 1080,
          originalWidth: 1920,
          ratio: 0.56,
        },
      ],
      [
        mediaSingleNode(1920, 1080, 50, 'percentage'),
        {
          height: 213,
          originalHeight: 1080,
          originalWidth: 1920,
          ratio: 0.56,
          width: 380,
        },
      ],
    ])(`should return correct dimensions`, (input, output) => {
      expect(
        getMediaSingleDimensions(PMNode.fromJSON(defaultSchema, input)),
      ).toMatchObject(output);
    });
  });
  describe('#getGuidelineTypeFromKey', () => {
    const defaultGuidelines = generateDefaultGuidelines(1000, 1200, false);
    const tempororayGuidelines: GuidelineConfig[] = [
      {
        key: 'temporary_x_guideline_1',
        position: {
          x: 10,
        },
      },
      {
        key: 'temporary_x_guideline_2',
        position: {
          x: -20,
        },
      },
    ];
    const relativeGuidelines: GuidelineConfig[] = [
      {
        key: 'relative_x_guideline_1',
        position: {
          x: 10,
          y: { start: 20, end: 50 },
        },
      },
      {
        key: 'relative_x_guideline_2',
        position: {
          x: -50,
          y: { start: 20, end: 50 },
        },
      },
      {
        key: 'relative_y_guideline_1',
        position: {
          y: 10,
          x: { start: 20, end: 50 },
        },
      },
    ];
    const fullGuidelineSet = [
      ...defaultGuidelines,
      ...tempororayGuidelines,
      ...relativeGuidelines,
    ];
    test.each<[{ keys: string[]; guidelines: GuidelineConfig[] }, string]>([
      [{ keys: [], guidelines: [] }, 'none'],
      [{ keys: ['inactive-guideline-key'], guidelines: [] }, 'none'],
      [{ keys: ['grid_1'], guidelines: defaultGuidelines }, 'default'],
      [{ keys: ['wide_1'], guidelines: defaultGuidelines }, 'default'],
      [
        { keys: ['grid_1', 'grid-8'], guidelines: defaultGuidelines },
        'default',
      ],
      [{ keys: ['full_width_1'], guidelines: defaultGuidelines }, 'default'],
      [
        { keys: ['inactive-guideline-key'], guidelines: defaultGuidelines },
        'none',
      ],
      [
        { keys: ['temporary_x_guideline_1'], guidelines: fullGuidelineSet },
        'temporary',
      ],
      [
        { keys: ['temporary_x_guideline_2'], guidelines: fullGuidelineSet },
        'temporary',
      ],
      [
        { keys: ['relative_x_guideline_1'], guidelines: fullGuidelineSet },
        'relative',
      ],
      [
        { keys: ['relative_x_guideline_2'], guidelines: fullGuidelineSet },
        'relative',
      ],
      [
        { keys: ['relative_y_guideline_1'], guidelines: fullGuidelineSet },
        'relative',
      ],
    ])(`Should return expected guideline type`, (input, output) => {
      expect(getGuidelineTypeFromKey(input.keys, input.guidelines)).toEqual(
        output,
      );
    });
  });
});
