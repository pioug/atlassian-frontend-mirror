import { rendererTestCase as test, expect } from './not-libra';

import {
	threeNormalParagraphs,
	firstParagraphCentered,
	secondParagraphCentered,
	thirdParagraphCentered,
	mixAlignmentParagraph,
} from './alignment.spec.ts-fixtures';
import { doc, p, table, tr, alignment, td, th } from '@atlaskit/editor-test-helpers/doc-builder';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';

test.describe('when the paragraphs are in the first level of the document', () => {
	test.describe('and when it is the first paragraph', () => {
		test.describe('and when it has not an alignment mark', () => {
			test.use({
				adf: threeNormalParagraphs,
			});
			test('should not set the margin-top (0px)', async ({ renderer }) => {
				const paragraphs = renderer.page.locator('p');
				await expect(paragraphs.first()).toHaveCSS('margin-top', '0px');
			});
		});

		test.describe('and when has an alignment mark', () => {
			test.use({
				adf: firstParagraphCentered,
			});
			test('should not set the margin-top (0px)', async ({ renderer }) => {
				const paragraphs = renderer.page.locator('.fabric-editor-alignment > p');
				await expect(paragraphs).toHaveCSS('margin-top', '0px');
			});
		});
	});

	test.describe('and when the first and second paragraph has different alignment marks', () => {
		test.use({
			adf: mixAlignmentParagraph,
		});
		test('should set the second paragraph margin-top', async ({ renderer }) => {
			const secondParagraph = renderer.page.locator(
				'.fabric-editor-alignment[data-align="end"] > p',
			);
			await expect(secondParagraph).not.toHaveCSS('margin-top', '0px');
		});
	});

	[
		{
			description: 'second paragraph',
			nthParagraph: 2,
			adf: secondParagraphCentered,
		},
		{
			description: 'third paragraph',
			nthParagraph: 3,
			adf: thirdParagraphCentered,
		},
	].forEach(({ adf, nthParagraph, description }) => {
		test.describe(`case ${description}`, () => {
			test.describe('and when it has not an alignment mark', () => {
				test.use({
					adf: threeNormalParagraphs,
				});
				test('should have the margin-top', async ({ renderer }) => {
					const paragraph = renderer.page.locator(
						`.ak-renderer-document p:nth-of-type(${nthParagraph})`,
					);
					await expect(paragraph).not.toHaveCSS('margin-top', '0px');
				});
			});

			test.describe('and when has an alignment mark', () => {
				test.use({
					adf,
				});
				test('should set the margin-top', async ({ renderer }) => {
					const paragraph = renderer.page.locator('.fabric-editor-alignment > p');
					await expect(paragraph).not.toHaveCSS('margin-top', '0px');
				});
			});
		});
	});

	[
		{
			description: 'table header',
			cellType: th,
		},
		{
			description: 'table cell',
			cellType: td,
		},
	].forEach(({ description, cellType }) => {
		test.describe(`${description}`, () => {
			const pmDocument = doc(
				table()(tr(cellType()(p('paragraph ONE'), p('paragraph TWO'), p('paragraph THREE')))),
			)(defaultSchema);
			const adf = { version: 1, ...pmDocument.toJSON() };
			test.use({
				adf,
			});
			test('should not set margin-top to first paragraph', async ({ renderer }) => {
				const paragraphs = renderer.page.locator('p');
				await expect(paragraphs.first()).toHaveCSS('margin-top', '0px');
			});

			test('should set margin-top to second paragraph', async ({ renderer }) => {
				const paragraphs = renderer.page.locator('p');
				await expect(paragraphs.nth(1)).not.toHaveCSS('margin-top', '0px');
			});

			test('should set margin-top to third paragraph', async ({ renderer }) => {
				const paragraphs = renderer.page.locator('p');
				await expect(paragraphs.nth(2)).not.toHaveCSS('margin-top', '0px');
			});
		});
	});
});

[
	{
		description: 'table header',
		cellType: th,
	},
	{
		description: 'table cell',
		cellType: td,
	},
].forEach(({ description, cellType }) => {
	test.describe('when first paragraph has alignment mark inside table', () => {
		test.describe(`${description}`, () => {
			const pmDocument = doc(
				table()(
					tr(
						cellType()(
							alignment({ align: 'center' })(p('paragraph ONE')),
							p('paragraph TWO'),
							p('paragraph THREE'),
						),
					),
				),
			)(defaultSchema);

			const adf = { version: 1, ...pmDocument.toJSON() };

			test.use({ adf });

			test('should not set margin-top to first paragraph', async ({ renderer }) => {
				const paragraphs = renderer.page.locator('p');
				await expect(paragraphs.first()).toHaveCSS('margin-top', '0px');
			});
		});
	});
});

[
	{
		description: 'table header',
		cellType: th,
	},
	{
		description: 'table cell',
		cellType: td,
	},
].forEach(({ description, cellType }) => {
	test.describe('when nth paragraph has alignment mark inside table', () => {
		test.describe(`${description}`, () => {
			const case0 = {
				description: 'second paragraph',
				nthParagraph: 2,
				docBuilder: doc(
					table()(
						tr(
							cellType()(
								p('paragraph ONE'),
								alignment({ align: 'center' })(p('paragraph CENTER')),
								p('paragraph THREE'),
							),
						),
					),
				),
			};
			const case1 = {
				description: 'third paragraph',
				nthParagraph: 3,
				docBuilder: doc(
					table()(
						tr(
							cellType()(
								p('paragraph ONE'),
								p('paragraph TWO'),
								alignment({ align: 'center' })(p('paragraph CENTER')),
							),
						),
					),
				),
			};

			test.describe('case0', () => {
				const pmDocument = case0.docBuilder(defaultSchema);
				const adf = { version: 1, ...pmDocument.toJSON() };
				test.use({ adf });

				test('should set margin-top to 2nd paragraph', async ({ renderer }) => {
					const paragraph = renderer.page.locator('.fabric-editor-alignment > p');
					await expect(paragraph).not.toHaveCSS('margin-top', '0px');
				});
			});

			test.describe('case1', () => {
				const pmDocument = case1.docBuilder(defaultSchema);
				const adf = { version: 1, ...pmDocument.toJSON() };
				test.use({ adf });

				test('should set margin-top to 2nd paragraph', async ({ renderer }) => {
					const paragraph = renderer.page.locator('.fabric-editor-alignment > p');
					await expect(paragraph).not.toHaveCSS('margin-top', '0px');
				});
			});
		});
	});
});

[
	{
		description: 'table header',
		cellType: th,
	},
	{
		description: 'table cell',
		cellType: td,
	},
].forEach(({ description, cellType }) => {
	const pmDocument = doc(
		table()(
			tr(
				cellType()(
					alignment({ align: 'center' })(p('paragraph ONE')),
					alignment({ align: 'end' })(p('paragraph TWO')),
					p('paragraph THREE'),
				),
			),
		),
	)(defaultSchema);
	const adf = { version: 1, ...pmDocument.toJSON() };

	test.use({ adf });

	test.describe('when the first and second paragraph has different alignment marks', () => {
		test.describe(`${description}`, () => {
			test('should set the second paragraph margin-top', async ({ renderer }) => {
				const paragraph = renderer.page.locator('.fabric-editor-alignment[data-align="end"] > p');
				await expect(paragraph).not.toHaveCSS('margin-top', '0px');
			});
		});
	});
});
