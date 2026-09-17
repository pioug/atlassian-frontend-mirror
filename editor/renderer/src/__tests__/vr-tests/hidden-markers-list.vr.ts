import { snapshot } from '@af/visual-regression';

import {
	HiddenMarkersListCommentRenderer,
	HiddenMarkersListRenderer,
} from './hidden-markers-list.fixture.vr.ap';

snapshot(HiddenMarkersListRenderer, {
	description: 'hidden markers list should not show markers in full-page renderer',
});

snapshot(HiddenMarkersListCommentRenderer, {
	description: 'hidden markers list should not show markers in comment renderer',
});
