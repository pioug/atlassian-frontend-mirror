import * as highlightAdf from '../__fixtures__/highlight.adf.json';
import * as highlightOverlappedAdf from '../__fixtures__/highlight-overlapped.adf.json';
import * as highlightCustomColorsAdf from '../__fixtures__/highlight-custom-colors.adf.json';

import { generateRendererComponent } from '../__helpers/rendererComponents';
import { annotationInlineCommentProvider } from '../__helpers/rendererWithAnnotations';

export const BackgroundColorDefinedColors = generateRendererComponent({
  document: highlightAdf,
  appearance: 'comment',
});

export const BackgroundColorOverlapped = generateRendererComponent({
  document: highlightOverlappedAdf,
  appearance: 'comment',
  allowAnnotations: true,
  annotationProvider: {
    inlineComment: annotationInlineCommentProvider,
  },
});

export const BackgroundColorCustomColors = generateRendererComponent({
  document: highlightCustomColorsAdf,
  appearance: 'comment',
});
