/* eslint-disable testing-library/prefer-screen-queries */

import { snapshotInformational } from '@af/visual-regression';

import InlineEditorFallback from '../../examples/overlap-inline-editor-fallback.vr.ap';
import InlineEditor from '../../examples/overlap-inline-editor.vr.ap';

snapshotInformational(InlineEditor, {
	description: 'inline-editor-open',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Customer feedback', exact: true }).click();
		await page.getByRole('dialog').waitFor();
	},
});

snapshotInformational(InlineEditorFallback, {
	description: 'inline-editor-fallback-open',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Customer feedback', exact: true }).click();
		await page.waitForFunction(() => {
			const popover = document.querySelector<HTMLElement>('[data-testid="overlap-popover"]');
			return Boolean(popover?.style.top && popover.style.opacity !== '0');
		});
	},
});

snapshotInformational(InlineEditor, {
	description: 'inline-editor-validation',
	drawsOutsideBounds: true,
	prepare: async (page) => {
		await page.getByRole('button', { name: 'Customer feedback', exact: true }).click();
		await page.getByRole('button', { name: 'Toggle validation' }).click();
	},
});
