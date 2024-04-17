import { snapshot } from '@af/visual-regression';
import {
  MediaInlineADF,
  MediaInlineInParagraphADF,
  MediaInlineMultipleInParagraphADF,
} from './media-inline.fixtures';

snapshot(MediaInlineADF, {
  description: 'should render standalone component',
});

snapshot(MediaInlineInParagraphADF, {
  description: 'should render in paragraph',
});

snapshot(MediaInlineMultipleInParagraphADF, {
  description: 'should render multiple in paragraph',
});
