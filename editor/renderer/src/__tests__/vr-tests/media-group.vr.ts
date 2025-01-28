import { snapshot } from '@af/visual-regression';
import { MediaGroup, MediaGroupWithReactLooselyLazy } from './media-group.fixture';

snapshot(MediaGroup, {
	description: 'should render the media group',
	states: [{ state: 'hovered', selector: { byTestId: 'media-file-card-view' } }],
});

snapshot(MediaGroupWithReactLooselyLazy);
