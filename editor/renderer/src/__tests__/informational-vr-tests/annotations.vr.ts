// eslint-disable-next-line import/no-extraneous-dependencies
import type { Locator } from '@playwright/test';

import { snapshotInformational } from '@af/visual-regression';
import {
	RendererWithAnnotations,
	RendererWithTableAndAnnotations,
} from '../__helpers/rendererWithAnnotations';
import { selectors } from '../__helpers/page-objects/_annotation';
import { RendererWithAnnotationsOverMarks } from '../__helpers/renderer-with-text-highlighter';

snapshotInformational(RendererWithAnnotationsOverMarks, {
	description: 'displays the correct annotation highlight',
	featureFlags: {
		platform_renderer_nested_annotation_styling: true,
		platform_editor_emotion_refactor_renderer: true,
		editor_inline_comments_on_inline_nodes: true,
	},
	prepare: async (page) => {
		await page.waitForSelector(selectors.annotation);

		// Mutate DOM to set focus state - This state is added on product side.
		// This is a workaround until we have a better way to test this.
		// We rely on the focus state to apply the correct styling to the annotation.
		await page.evaluate(() => {
			const marks = document.querySelectorAll('mark[id="test-annotation-id-1"]');
			marks.forEach((mark) => {
				mark.setAttribute('data-has-focus', 'true');
			});
		});

		// click away to remove browser selection from highlighted text
		page.mouse.click(1, 1, {
			//short delay in between mouse down and up
			delay: 10,
		});

		expect(page.locator('[data-has-focus="true"]')).toHaveCount(2);
	},
});

snapshotInformational(RendererWithAnnotations, {
	description: 'displays draft highlight on select text and click to comment',
	featureFlags: {
		platform_renderer_nested_annotation_styling: false,
	},
	prepare: async (page) => {
		await page.waitForSelector(selectors.annotation);
		await selectTextToAnnotate(page.getByText('another text without annotation'));
		const commentButton = await page.waitForSelector(selectors.commentButton);
		await commentButton?.click();
		await page.waitForSelector(selectors.draftAnnotation);

		// click away to remove browser selection from highlighted text
		page.mouse.click(1, 1, {
			//short delay in between mouse down and up
			delay: 10,
		});
	},
});

snapshotInformational(RendererWithTableAndAnnotations, {
	description: 'annotates entire selection on triple click',
	featureFlags: {
		platform_renderer_nested_annotation_styling: false,
	},
	prepare: async (page) => {
		const textNode = page.getByText('Inside a table');
		await textNode.click({ clickCount: 3 });
		const commentButton = await page.waitForSelector(selectors.commentButton);
		await commentButton?.click();
		await page.waitForSelector(selectors.draftAnnotation);
		// click away to remove browser selection from highlighted text
		page.mouse.click(1, 1, {
			//short delay in between mouse down and up
			delay: 10,
		});
	},
});

//evaluating on browser to get reliable selection
async function selectTextToAnnotate(locator: Locator) {
	return await locator.evaluate((element: HTMLElement) => {
		const selection = window.getSelection();
		const range = document.createRange();
		range.setStart(element.childNodes[0], 0);
		range.setEnd(element.childNodes[0], element?.innerText?.length);
		selection?.removeAllRanges();
		selection?.addRange(range);
	});
}
