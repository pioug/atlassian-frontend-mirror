import { snapshot } from '@af/visual-regression';

import {
	HiddenMarkersMixedListCommentRenderer,
	HiddenMarkersMixedListRenderer,
} from './hidden-markers-mixed-list.fixture.vr.ap';

snapshot(HiddenMarkersMixedListRenderer, {
	description: 'hidden markers mixed list should show task checkboxes in full-page renderer',
});

snapshot(HiddenMarkersMixedListCommentRenderer, {
	description: 'hidden markers mixed list should show task checkboxes in comment renderer',
});
