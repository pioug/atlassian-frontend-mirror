import memoizeOne from 'memoize-one';
import type { GuidelineConfig } from '@atlaskit/editor-common/guideline';
import type { EditorView } from 'prosemirror-view';
import {
  akEditorGutterPadding,
  akEditorFullWidthLayoutWidth,
  breakoutWideScaleRatio,
} from '@atlaskit/editor-shared-styles';
import { MEDIA_DYNAMIC_GUIDELINE_PREFIX } from '@atlaskit/editor-common/guideline';

const mediaSingleSelector =
  'div.mediaSingleView-content-wrap:not(.ProseMirror-selectednode)';

const getDefaultGuidelines = memoizeOne((editorWidth) => {
  return [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((val, index) => ({
    key: `grid_${index}`,
    position: {
      x: (val / 12) * editorWidth,
    },
  })) as GuidelineConfig[];
});

const getWideGuidelines = memoizeOne((editorWidth: number) => {
  const wideSpacing = (editorWidth * breakoutWideScaleRatio) / 2;
  return [
    {
      key: `wide_left`,
      position: {
        x: -wideSpacing,
      },
    } as GuidelineConfig,
    {
      key: `wide_right`,
      position: {
        x: wideSpacing,
      },
    } as GuidelineConfig,
  ];
});

const getFullWidthGuidelines = memoizeOne((containerWidth: number) => {
  const fullWidth =
    Math.min(
      containerWidth - akEditorGutterPadding * 2,
      akEditorFullWidthLayoutWidth,
    ) / 2;

  return [
    {
      key: `full_width_left`,
      position: {
        x: -fullWidth,
      },
    } as GuidelineConfig,
    {
      key: `full_width_right`,
      position: {
        x: fullWidth,
      },
    } as GuidelineConfig,
  ];
});

export const generateDefaultGuidelines = (
  editorWidth: number,
  containerWidth: number,
  isFullWidthMode: boolean | undefined = false,
) => {
  const innerGrids = getDefaultGuidelines(editorWidth);
  const wideGuidelines = !isFullWidthMode ? getWideGuidelines(editorWidth) : [];
  const fullWidthGuidelines = !isFullWidthMode
    ? getFullWidthGuidelines(containerWidth)
    : [];

  return [...innerGrids, ...wideGuidelines, ...fullWidthGuidelines];
};

export const generateDynamicGuidelines = (view: EditorView) => {
  const { dom } = view;
  const { width } = dom.getBoundingClientRect();
  const halfWidth = width / 2;

  let keyIdx = 0;

  const dynamicGuidelines = [...dom.querySelectorAll(mediaSingleSelector)]
    .map((elem, _index) => {
      const pixelWidthAttr =
        elem.getAttribute('widthType') === 'pixel'
          ? elem.getAttribute('width')
          : '';
      const pixelWidth = parseFloat(pixelWidthAttr || '');
      if (Number.isNaN(pixelWidth)) {
        return [];
      }
      const commonStyles = {
        styles: {
          lineStyle: 'dashed',
        },
        show: false,
      };

      const key = `${MEDIA_DYNAMIC_GUIDELINE_PREFIX}${++keyIdx}`;

      switch (elem.getAttribute('layout')) {
        case 'align-start':
        case 'wrap-left':
          return {
            position: { x: pixelWidth - halfWidth },
            key,
            ...commonStyles,
          } as GuidelineConfig;
        case 'align-end':
        case 'wrap-right':
          return {
            position: { x: width - pixelWidth - halfWidth },
            key,
            ...commonStyles,
          } as GuidelineConfig;
        case 'center':
          return [
            {
              position: { x: pixelWidth / 2 },
              key,
              ...commonStyles,
            },
            {
              position: { x: -pixelWidth / 2 },
              key,
              ...commonStyles,
            },
          ] as GuidelineConfig[];
        // we ignore full-width and wide
        default:
          return [] as GuidelineConfig[];
      }
    })
    .flat();

  return dynamicGuidelines;
};
