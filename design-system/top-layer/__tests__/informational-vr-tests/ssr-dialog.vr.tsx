import { snapshotInformational } from '@af/visual-regression';

import DialogSsrInitialOpen from '../../examples/151-testing-dialog-ssr-initial-open';

// Keep `description` on a single line. The Gemini VR
// transformer has a bug where two `snapshotInformational(...)` calls in the
// same file whose `description` reflow shape differs cause only one of them
// to be transformed (the other is left as a raw runtime call and throws
// `directCallErrorMsg`, manifesting as "No tests found"). Locking formatting
// here keeps the layout that the transformer handles correctly.
snapshotInformational(DialogSsrInitialOpen, {
	// prettier-ignore
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
