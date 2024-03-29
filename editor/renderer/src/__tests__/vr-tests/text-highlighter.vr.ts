import { snapshot } from '@af/visual-regression';
import {
  RendererWithTextHighlighter,
  RendererWithFilteredTextHighlighter,
} from '../__helpers/renderer-with-text-highlighter';

snapshot(RendererWithTextHighlighter);

snapshot(RendererWithFilteredTextHighlighter);
