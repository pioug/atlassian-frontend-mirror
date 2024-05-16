import { snapshot } from '@af/visual-regression';
import { MediaComment, MediaCommentWrapped } from './media-comment.fixture';

snapshot(MediaComment, {
  description: 'should renderer the same size for comment apperance',
});

snapshot(MediaCommentWrapped, {
  description: 'should render correct sizes for wrapped media',
});
