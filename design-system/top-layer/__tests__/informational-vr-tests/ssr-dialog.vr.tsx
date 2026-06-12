import { snapshotInformational } from '@af/visual-regression';

import DialogSsrInitialOpen from '../../examples/151-testing-dialog-ssr-initial-open';

snapshotInformational(DialogSsrInitialOpen, {
	description:
		'Dialog with isOpen=true on initial render: open and animated in after hydration',
	drawsOutsideBounds: true,
});

snapshotInformational(DialogSsrInitialOpen, {
	description: 'Dialog after consumer closes it via the Close button',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByTestId('ssr-initial-open-dialog-close').click();
	},
});
