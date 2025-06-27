import { rendererTestCase as test, expect } from './not-libra';
import {
	helloEmojiAdf,
	helloAdf,
	loremLoremAdf,
	decisionListAdf,
	taskListAdf,
	bigNestedAdf,
	helloMateEmojiAdf,
} from './annotate.spec.ts-fixtures';

const CHAR_WIDTH = 6;
const rendererMountOptions = { withRendererActions: true };

test.describe('annotations', () => {
	test.use({ rendererMountOptions });

	test.describe('when text selection that contains inline nodes', () => {
		test.use({ adf: helloMateEmojiAdf });

		test(`Can't create an annotation on a text selection that contains inline nodes`, async ({
			renderer,
		}) => {
			const paragraphs = renderer.page.locator('p');

			const box = await paragraphs.first().boundingBox();

			const middleBox = box!.y + box!.height / 2;
			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box!.x + box!.width, middleBox);
			await renderer.page.mouse.up();

			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');

			expect(result).toBe(false);
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			const paragraphs = renderer.page.locator('p');
			const box = await paragraphs.first().boundingBox();
			const middleBox = box!.y + box!.height / 2;
			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box!.x + box!.width, middleBox);
			await renderer.page.mouse.up();
			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');
			expect(result).toBe(false);

			await expect(renderer.page).toBeAccessible();
		});
	});

	test.describe('when text selection that falls in the middle of an inline node', () => {
		test.use({ adf: helloEmojiAdf });
		test(`Can't create an annotation`, async ({ renderer }) => {
			const paragraphs = renderer.page.locator('p');

			const box = await paragraphs.first().boundingBox();

			const middleBox = box!.y + box!.height / 2;
			const THREE_CHARS_WIDTH = CHAR_WIDTH * 3;
			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box!.x + THREE_CHARS_WIDTH, middleBox);
			await renderer.page.mouse.up();

			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');

			expect(result).toBe(false);
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			const paragraphs = renderer.page.locator('p');
			const box = await paragraphs.first().boundingBox();
			const middleBox = box!.y + box!.height / 2;
			const THREE_CHARS_WIDTH = CHAR_WIDTH * 3;
			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box!.x + THREE_CHARS_WIDTH, middleBox);
			await renderer.page.mouse.up();
			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');
			expect(result).toBe(false);

			await expect(renderer.page).toBeAccessible();
		});
	});

	test.describe('when selecting basic text', () => {
		test.use({ adf: helloAdf });
		test('Can create an annotation', async ({ renderer }) => {
			const paragraphs = renderer.page.locator('p');

			const box = await paragraphs.first().boundingBox();

			const middleBox = box!.y + box!.height / 2;
			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box!.x + CHAR_WIDTH, middleBox);
			await renderer.page.mouse.up();

			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');

			expect(result).toBeTruthy();
			expect(result as Record<string, unknown>).toMatchDocumentSnapshot();
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			const paragraphs = renderer.page.locator('p');
			const box = await paragraphs.first().boundingBox();
			const middleBox = box!.y + box!.height / 2;
			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box!.x + CHAR_WIDTH, middleBox);
			await renderer.page.mouse.up();
			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');
			expect(result).toBeTruthy();
			expect(result as Record<string, unknown>).toMatchDocumentSnapshot();

			await expect(renderer.page).toBeAccessible();
		});
	});

	test.describe('when selecting multiple paragraphs', () => {
		test.use({ adf: loremLoremAdf });

		test('Can create an annotation on a text selection over two paragraphs', async ({
			renderer,
		}) => {
			const paragraphs = renderer.page.locator('p');

			const box = await paragraphs.first().boundingBox();
			const box2 = await paragraphs.last().boundingBox();

			const middleBox = box!.y + box!.height / 2;
			const middleBox2 = box2!.y + box2!.height / 2;

			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box2!.x + box2!.width, middleBox2);
			await renderer.page.mouse.up();

			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');

			expect(result).toBeTruthy();
			expect(result as Record<string, unknown>).toMatchDocumentSnapshot();
		});

		test('should capture and report a11y violations', async ({ renderer }) => {
			const paragraphs = renderer.page.locator('p');
			const box = await paragraphs.first().boundingBox();
			const box2 = await paragraphs.last().boundingBox();
			const middleBox = box!.y + box!.height / 2;
			const middleBox2 = box2!.y + box2!.height / 2;
			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box2!.x + box2!.width, middleBox2);
			await renderer.page.mouse.up();
			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');
			expect(result).toBeTruthy();
			expect(result as Record<string, unknown>).toMatchDocumentSnapshot();

			await expect(renderer.page).toBeAccessible();
		});
	});

	test.describe('when selecting a decision item', () => {
		test.use({ adf: decisionListAdf });

		test('Can create an annotation on a text selection over a decision item', async ({
			renderer,
		}) => {
			const paragraphs = renderer.page.locator('p');

			const box = await paragraphs.first().boundingBox();
			const box2 = await paragraphs.last().boundingBox();

			const middleBox = box!.y + box!.height / 2;
			const middleBox2 = box2!.y + box2!.height / 2;

			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box2!.x + CHAR_WIDTH, middleBox2);
			await renderer.page.mouse.up();

			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');

			expect(result).toBeTruthy();
			expect(result as Record<string, unknown>).toMatchDocumentSnapshot();
		});
	});

	test.describe('when selecting a task item', () => {
		test.use({ adf: taskListAdf });
		test('Can create an annotation on a text selection over a task item', async ({ renderer }) => {
			const paragraphs = renderer.page.locator('p');

			const box = await paragraphs.first().boundingBox();
			const box2 = await paragraphs.last().boundingBox();

			const middleBox = box!.y + box!.height / 2;
			const middleBox2 = box2!.y + box2!.height / 2;

			await renderer.page.mouse.move(box!.x, middleBox);
			await renderer.page.mouse.down();
			await renderer.page.mouse.move(box2!.x + CHAR_WIDTH, middleBox2);
			await renderer.page.mouse.up();

			const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');

			expect(result).toBeTruthy();
			expect(result as Record<string, unknown>).toMatchDocumentSnapshot();
		});
	});
});

const PARAGRAPH_INSIDE_TABLE_CONTAINER = '.pm-table-container p';
const PARAGRAPAH_INSIDE_LIST_INSIDE_PANEL_INSIDE_TABLE_CONTAINER = '.pm-table-container p';
test.describe('annotations: nested', () => {
	test.use({ adf: bigNestedAdf });
	test.use({ rendererMountOptions });

	test(`Can create an annotation on nested text inside a list inside a table`, async ({
		renderer,
	}) => {
		const firstParagraphInsideTable = renderer.page
			.locator(PARAGRAPH_INSIDE_TABLE_CONTAINER)
			.first();
		const paragraphInsideAListInsidePanelInsideATable = renderer.page
			.locator(PARAGRAPAH_INSIDE_LIST_INSIDE_PANEL_INSIDE_TABLE_CONTAINER)
			.last();

		const box = await firstParagraphInsideTable.boundingBox();
		const box2 = await paragraphInsideAListInsidePanelInsideATable.boundingBox();

		const middleBox = box!.y + box!.height / 2;
		const middleBox2 = box2!.y + box2!.height / 2;

		await renderer.page.mouse.move(box!.x, middleBox);
		await renderer.page.mouse.down();
		await renderer.page.mouse.move(box2!.x + CHAR_WIDTH, middleBox2);
		await renderer.page.mouse.up();

		const result = await renderer.annotation.simulateAnnotationAtSelection('fake-id-1');

		expect(result).toBeTruthy();
		expect(result as Record<string, unknown>).toMatchDocumentSnapshot();
	});

	test.describe('bodied extensions', () => {
		test.use({
			rendererMountOptions: { exampleType: 'annotations-new-playwright' },
		});

		test('Can create an annotation on a bodied extension', async ({ renderer }) => {
			// Click on the first word in the second paragraph (the test document is setup to have an extension there)
			await renderer.page
				.locator('p')
				.nth(1)
				.dblclick({ position: { x: 10, y: 10 } });

			const draftComment = renderer.page.locator('[data-annotation-draft-mark]');
			const commentButton = renderer.page.getByText('comment (enabled)');

			// Ensure the comment button is shown -- and then click on it.
			await expect(commentButton).toBeVisible();
			await commentButton.click();

			// Ensure the draft comment is shown and has the correct text.
			await expect(draftComment).toBeVisible();
			await expect(draftComment).toHaveText('nested');

			await expect(renderer.page.getByText('save comment')).toBeVisible();
			await renderer.page.getByText('save comment').click();

			// Ensure the comment is committed to the document
			const savedComment = renderer.page.locator('[data-mark-annotation-state=active]');
			await expect(savedComment).toBeVisible();
			await expect(savedComment).toHaveText('nested');
		});
	});
});
