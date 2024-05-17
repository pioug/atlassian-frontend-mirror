import * as backgroundColorAdf from '../__fixtures__/backgroundColor.adf.json';
import * as backgroundColorOverlappedAdf from '../__fixtures__/backgroundColor-overlapped.adf.json';
import * as backgroundColorCustomColorsAdf from '../__fixtures__/backgroundColor-custom-colors.adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents';
import { annotationInlineCommentProvider } from '../__helpers/rendererWithAnnotations';

export const BackgroundColorDefinedColors = generateRendererComponent({
  document: backgroundColorAdf,
  appearance: 'comment',
});

export const BackgroundColorOverlapped = generateRendererComponent({
  document: backgroundColorOverlappedAdf,
  appearance: 'comment',
  allowAnnotations: true,
  annotationProvider: {
    inlineComment: annotationInlineCommentProvider
  }
});

export const BackgroundColorCustomColors = generateRendererComponent({
  document: backgroundColorCustomColorsAdf,
  appearance: 'comment',
});
