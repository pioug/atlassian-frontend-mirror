import { snapshotInformational } from '@af/visual-regression';

import SsrInitialOpenModal from '../../../examples/103-ssr-initial-open';

snapshotInformational(SsrInitialOpenModal, {
	description:
		'Modal with isOpen=true on initial render: animated in after hydration (parity across feature flag)',
	drawsOutsideBounds: true,
	featureFlags: {
		'platform-dst-top-layer': [true, false],
	},
});
