import { snapshot } from '@af/visual-regression';
import {
  MediaBorderADF,
  MediaBorderWithinTableADF,
  MediaBorderWithLinkADF,
} from './media-border.fixtures';

snapshot(MediaBorderADF, {
  description: 'should render caption correctly',
});

snapshot(MediaBorderWithinTableADF, {
  description: 'should render long caption correctly',
});

snapshot(MediaBorderWithLinkADF, {
  description: 'should render complicated caption correctly',
});
