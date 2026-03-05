import { createSchema } from '../../../schema/create-schema';
import type { SchemaConfig } from '../../../schema/create-schema';
import { fromHTML, toHTML } from '@af/adf-test-helpers/src/adf-schema/html-helpers';

const packageName = process.env.npm_package_name as string;

describe(`${packageName}/schema content model - fontSize in sync blocks and extensions`, () => {
	const schema = makeSchema();

	describe('bodiedSyncBlock with fontSize', () => {
		it('paragraph with fontSize is valid inside bodiedSyncBlock', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text in sync block')],
				[fontSizeMark],
			);
			const bodiedSyncBlock = schema.nodes.bodiedSyncBlock.create(
				{ resourceId: 'sync-resource-123' },
				[paragraph],
			);

			expect(bodiedSyncBlock.childCount).toBe(1);
			expect(bodiedSyncBlock.firstChild!.type.name).toBe('paragraph');
			expect(bodiedSyncBlock.firstChild!.marks).toHaveLength(1);
			expect(bodiedSyncBlock.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(bodiedSyncBlock.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});

		it('bodiedSyncBlock can contain multiple paragraphs with different fontSize values', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph1 = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text')],
				[fontSizeMark],
			);
			const paragraph2 = schema.nodes.paragraph.create({}, [schema.text('Normal text')], []);
			const bodiedSyncBlock = schema.nodes.bodiedSyncBlock.create(
				{ resourceId: 'sync-resource-123' },
				[paragraph1, paragraph2],
			);

			expect(bodiedSyncBlock.childCount).toBe(2);
			expect(bodiedSyncBlock.firstChild!.marks).toHaveLength(1);
			expect(bodiedSyncBlock.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(bodiedSyncBlock.lastChild!.marks).toHaveLength(0);
		});

		it('bodiedSyncBlock with fontSize paragraph validates correctly', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text')],
				[fontSizeMark],
			);
			const bodiedSyncBlock = schema.nodes.bodiedSyncBlock.create(
				{ resourceId: 'sync-resource-123' },
				[paragraph],
			);

			const html = toHTML(bodiedSyncBlock, schema);
			const parsedDoc = fromHTML(html, schema);
			const parsedSyncBlock = parsedDoc.firstChild!;

			expect(parsedSyncBlock.type.name).toBe('bodiedSyncBlock');
			expect(parsedSyncBlock.firstChild).toBeTruthy();
			expect(parsedSyncBlock.firstChild!.marks).toHaveLength(1);
			expect(parsedSyncBlock.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(parsedSyncBlock.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});
	});

	describe('bodiedExtension with fontSize', () => {
		it('paragraph with fontSize is valid inside bodiedExtension', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text in extension')],
				[fontSizeMark],
			);
			const bodiedExtension = schema.nodes.bodiedExtension.create(
				{
					extensionType: 'com.atlassian.confluence.macro',
					extensionKey: 'testMacro',
				},
				[paragraph],
			);

			expect(bodiedExtension.childCount).toBe(1);
			expect(bodiedExtension.firstChild!.type.name).toBe('paragraph');
			expect(bodiedExtension.firstChild!.marks).toHaveLength(1);
			expect(bodiedExtension.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(bodiedExtension.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});

		it('bodiedExtension can contain multiple paragraphs with different fontSize values', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph1 = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text')],
				[fontSizeMark],
			);
			const paragraph2 = schema.nodes.paragraph.create({}, [schema.text('Normal text')], []);
			const bodiedExtension = schema.nodes.bodiedExtension.create(
				{
					extensionType: 'com.atlassian.confluence.macro',
					extensionKey: 'testMacro',
				},
				[paragraph1, paragraph2],
			);

			expect(bodiedExtension.childCount).toBe(2);
			expect(bodiedExtension.firstChild!.marks).toHaveLength(1);
			expect(bodiedExtension.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(bodiedExtension.lastChild!.marks).toHaveLength(0);
		});

		it('bodiedExtension with fontSize paragraph validates correctly', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text')],
				[fontSizeMark],
			);
			const bodiedExtension = schema.nodes.bodiedExtension.create(
				{
					extensionType: 'com.atlassian.confluence.macro',
					extensionKey: 'testMacro',
				},
				[paragraph],
			);

			// Verify the node structure is valid
			expect(bodiedExtension.type.name).toBe('bodiedExtension');
			expect(bodiedExtension.firstChild).toBeTruthy();
			expect(bodiedExtension.firstChild!.type.name).toBe('paragraph');
			expect(bodiedExtension.firstChild!.marks).toHaveLength(1);
			expect(bodiedExtension.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(bodiedExtension.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});
	});

	describe('extensionFrame with fontSize (stage0)', () => {
		it('paragraph with fontSize is valid inside extensionFrame', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text in extension frame')],
				[fontSizeMark],
			);
			const extensionFrame = schema.nodes.extensionFrame.create(
				{
					extensionType: 'com.atlassian.confluence.macro',
					extensionKey: 'testFrame',
				},
				[paragraph],
			);

			expect(extensionFrame.childCount).toBe(1);
			expect(extensionFrame.firstChild!.type.name).toBe('paragraph');
			expect(extensionFrame.firstChild!.marks).toHaveLength(1);
			expect(extensionFrame.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(extensionFrame.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});

		it('extensionFrame can contain multiple paragraphs with different fontSize values', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph1 = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text')],
				[fontSizeMark],
			);
			const paragraph2 = schema.nodes.paragraph.create({}, [schema.text('Normal text')], []);
			const extensionFrame = schema.nodes.extensionFrame.create(
				{
					extensionType: 'com.atlassian.confluence.macro',
					extensionKey: 'testFrame',
				},
				[paragraph1, paragraph2],
			);

			expect(extensionFrame.childCount).toBe(2);
			expect(extensionFrame.firstChild!.marks).toHaveLength(1);
			expect(extensionFrame.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(extensionFrame.lastChild!.marks).toHaveLength(0);
		});

		it('extensionFrame with fontSize paragraph validates correctly', () => {
			const fontSizeMark = schema.marks.fontSize.create({ fontSize: 'small' });
			const paragraph = schema.nodes.paragraph.create(
				{},
				[schema.text('Small text')],
				[fontSizeMark],
			);
			const extensionFrame = schema.nodes.extensionFrame.create(
				{
					extensionType: 'com.atlassian.confluence.macro',
					extensionKey: 'testFrame',
				},
				[paragraph],
			);

			// Verify the node structure is valid
			expect(extensionFrame.type.name).toBe('extensionFrame');
			expect(extensionFrame.firstChild).toBeTruthy();
			expect(extensionFrame.firstChild!.type.name).toBe('paragraph');
			expect(extensionFrame.firstChild!.marks).toHaveLength(1);
			expect(extensionFrame.firstChild!.marks[0].type.name).toBe('fontSize');
			expect(extensionFrame.firstChild!.marks[0].attrs.fontSize).toBe('small');
		});
	});
});

function makeSchema() {
	const config: SchemaConfig = {
		nodes: [
			'doc',
			'paragraph',
			'text',
			'bodiedSyncBlock',
			'syncBlock',
			'bodiedExtension',
			'extensionFrame',
		],
		marks: ['fontSize', 'unsupportedMark', 'unsupportedNodeAttribute'],
	};
	return createSchema(config);
}
