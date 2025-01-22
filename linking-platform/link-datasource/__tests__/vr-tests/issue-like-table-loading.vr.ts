import { snapshot } from '@af/visual-regression';

import IssueLikeTableLoading from '../../examples/vr/issue-like-table-loading';

snapshot(IssueLikeTableLoading, {
	description: 'loading state Issue Like Table',
	drawsOutsideBounds: true,
});
