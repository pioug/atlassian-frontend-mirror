/* eslint-disable
  @atlaskit/design-system/no-to-match-snapshot,
  @atlaskit/design-system/no-unsafe-inline-snapshot
  -- TODO(IND-4952): existing snapshot tests will be removed in a follow-up cleanup PR.
  See https://hello.atlassian.net/wiki/spaces/afm/pages/7146174189/LDR+Unit+Tests+-+Ban+Snapshot+tests+in+Platform
  and raise concerns in https://atlassian.enterprise.slack.com/archives/C0BD4K40BLH
*/

import MockDate from 'mockdate';

import { defaultSchema, getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';

import EmailSerializer from '../..';
import type { EmailSerializerOpts, MetaDataContext } from '../../interfaces';
import { ALLOWED_COLORS, styles as statusStyles } from '../../nodes/status';
import * as actionInsideList from './__fixtures__/action-inside-list.adf.json';
import * as annotation from './__fixtures__/annotation.adf.json';
import * as backgroundColor from './__fixtures__/background-color.adf.json';
import * as blockCards from './__fixtures__/block-cards.adf.json';
import * as blockquoteWithList from './__fixtures__/blockquote-with-list.json';
import * as bodiedSyncBlock from './__fixtures__/bodied-sync-block.adf.json';
import * as breakout from './__fixtures__/breakout.adf.json';
import * as caption from './__fixtures__/caption.adf.json';
import * as codeBlock from './__fixtures__/code-block.adf.json';
import * as codeblockInQuote from './__fixtures__/codeblock-in-quote.adf.json';
import * as date from './__fixtures__/date.adf.json';
import * as decisionList from './__fixtures__/decision-list.adf.json';
import * as em from './__fixtures__/em.adf.json';
import * as embedCards from './__fixtures__/embed-cards.adf.json';
import * as expand from './__fixtures__/expand.adf.json';
import * as nestedExpand from './__fixtures__/extended-nested-expand.adf.json';
import * as extendedPanel from './__fixtures__/extended-panel.adf.json';
import * as extensions from './__fixtures__/extensions.adf.json';
import * as headingAlign from './__fixtures__/heading-align.adf.json';
import * as heading from './__fixtures__/heading.adf.json';
import * as hiddenMarkersList from './__fixtures__/hidden-markers-list.adf.json';
import * as hiddenMarkersMixedList from './__fixtures__/hidden-markers-mixed-list.adf.json';
import * as hiddenMarkersTaskList from './__fixtures__/hidden-markers-task-list.adf.json';
import * as image from './__fixtures__/image.adf.json';
import * as inlineCards from './__fixtures__/inline-cards.adf.json';
import * as inlineCodeProps from './__fixtures__/inline-code-props.adf.json';
import * as inlineTextProps from './__fixtures__/inline-text-props.adf.json';
import * as layoutColumnSection from './__fixtures__/layout-column-section.adf.json';
import * as linkRelative from './__fixtures__/link-relative.adf.json';
import * as link from './__fixtures__/link.adf.json';
import * as lists from './__fixtures__/lists.adf.json';
import * as mediaGroupAllTypes from './__fixtures__/media-group-all-types.adf.json';
import * as mediaGroupInQuote from './__fixtures__/media-group-in-quote.adf.json';
import * as mediaGroup from './__fixtures__/media-group.adf.json';
import * as mediaInlineAllTypes from './__fixtures__/media-inline-all-types.adf.json';
import * as mediaInlineImageAllTypes from './__fixtures__/media-inline-image-all-types.adf.json';
import * as mediaInline from './__fixtures__/media-inline.adf.json';
import * as mediaSingleExternalImage from './__fixtures__/media-single-external-image.adf.json';
import * as mediaSingleInQuote from './__fixtures__/media-single-in-quote.adf.json';
import * as mediaSingleWithPixelSizing from './__fixtures__/media-single-pixel-sizing.adf.json';
import * as mediaSingle from './__fixtures__/media-single.adf.json';
import * as mention from './__fixtures__/mention.adf.json';
import * as nestedExpandInExpand from './__fixtures__/nested-expand-in-expand.adf.json';
import * as nestedTablesInvalid from './__fixtures__/nested-tables-extension-invalid.adf.json';
import * as nestedTables from './__fixtures__/nested-tables-extension.adf.json';
import * as nestedTaskList from './__fixtures__/nested-task-list.adf.json';
import * as orderedList from './__fixtures__/ordered-list.adf.json';
import * as panels from './__fixtures__/panels.adf.json';
import * as paragraphAlign from './__fixtures__/paragraph-align.adf.json';
import * as paragraphIndents from './__fixtures__/paragraph-indents.adf.json';
import * as placeholder from './__fixtures__/placeholder.adf.json';
import * as redaction from './__fixtures__/redaction-extension.adf.json';
import * as status from './__fixtures__/status.adf.json';
import * as syncBlock from './__fixtures__/sync-block.adf.json';
import * as tableNumberedColumn from './__fixtures__/table-numbered-column.adf.json';
import * as taskListDeepNesting from './__fixtures__/task-list-deep-nesting.adf.json';
import * as taskListMixedStates from './__fixtures__/task-list-mixed-states.adf.json';
import * as taskListRichContent from './__fixtures__/task-list-rich-content.adf.json';
import * as taskList from './__fixtures__/task-list.adf.json';
import * as textColor from './__fixtures__/text-color.adf.json';
import * as text from './__fixtures__/text.adf.json';

const defaultTestOpts: EmailSerializerOpts = {
	isImageStubEnabled: false,
	isInlineCSSEnabled: true,
};

const baseURLContext: MetaDataContext = {
	baseURL: 'https://example.com',
};

const incorrectBaseURLContext: MetaDataContext = {
	baseURL: 'incorrectBaseURL',
};

const mediaContext: MetaDataContext = {
	hydration: {
		mediaMetaData: {
			'media-type-image': {
				name: 'Dark wallpaper theme.jpg',
				mediaType: 'image',
				mimeType: 'image/jpeg',
				size: 54981,
			},
			'media-type-doc': {
				name: 'My bachelor thesis.pdf',
				mediaType: 'doc',
				mimeType: 'application/pdf',
				size: 12345,
			},
			'media-type-video': {
				name: 'Metallica full concert.mpeg',
				mediaType: 'video',
				mimeType: 'vide/mpeg',
				size: 982347,
			},
			'media-type-audio': {
				name: 'The sound of silence.mp3',
				mediaType: 'audio',
				mimeType: 'audio/mpeg',
				size: 98734,
			},
			'media-type-archive': {
				name: 'The Slackening.zip',
				mediaType: 'archive',
				mimeType: 'application/zip',
				size: 4383,
			},
			'media-type-unknown': {
				name: 'unknown',
				mediaType: 'unknown',
				mimeType: 'unknown',
				size: 54981,
			},
		},
	},
};

const highlightedMentionNodeContext: MetaDataContext = {
	highlightedMentionNodeID: '1234',
};

const render = (
	doc: any,
	serializerOptions: Partial<EmailSerializerOpts> = {},
	context?: MetaDataContext,
	schemaStage?: string,
) => {
	const opts = {
		...defaultTestOpts,
		...serializerOptions,
	};
	const schema = schemaStage ? getSchemaBasedOnStage(schemaStage) : getSchemaBasedOnStage();
	const serializer = new EmailSerializer(schema, opts);
	const docFromSchema = schema.nodeFromJSON(doc);
	const { result, embeddedImages } = serializer.serializeFragmentWithImages(
		docFromSchema.content,
		context,
	);
	const node = document.createElement('div');
	node.innerHTML = result!;
	return {
		result:
			node.firstChild instanceof Element
				? node.firstChild.outerHTML
				: (node.firstChild?.textContent ?? ''),
		embeddedImages,
	};
};

const expectEmbeddedImageIds = (
	embeddedImages: ReturnType<typeof render>['embeddedImages'],
	contentIds: string[],
) => {
	expect(embeddedImages).toEqual(
		contentIds.map((contentId) =>
			expect.objectContaining({
				contentId,
				contentType: 'image/png',
				data: expect.any(String),
			}),
		),
	);
};

describe('EmailSerializer constructor', () => {
	MockDate.reset();
	it('should initialize with default values', () => {
		const s = new EmailSerializer(defaultSchema);
		expect(s.opts).toEqual({
			isImageStubEnabled: false,
			isInlineCSSEnabled: false,
		});
	});
	it('should override default values', () => {
		const s = new EmailSerializer(defaultSchema, { isInlineCSSEnabled: true });
		expect(s.opts).toEqual({
			isImageStubEnabled: false,
			isInlineCSSEnabled: true,
		});
	});
});

describe('Renderer - EmailSerializer', () => {
	it('should render nothing for image node', () => {
		const { result } = render(image);
		expect(result).toContain('font-size: 14px');
		expect(result).toContain('line-height: 24px');
		expect(result).not.toContain('<img');
		expect(result).not.toContain('<p');
	});

	it('should render nothing for placeholder node', () => {
		const { result } = render(placeholder);
		expect(result).toContain('<p');
		expect(result).toContain('&nbsp;');
		expect(result).not.toContain('<img');
	});

	it('should apply no mark for annotation marks', () => {
		const { result } = render(annotation);
		expect(result).toContain('I am annotated text and this sentence is a lie.');
		expect(result).not.toContain('annotation');
		expect(result).not.toContain('data-mark-type');
	});

	it('should apply no mark for breakout marks', () => {
		const { result } = render(breakout);
		expect(result).toContain('#!/bin/bash');
		expect(result).not.toContain('breakout');
		expect(result).not.toContain('data-layout');
	});

	it('should apply textColor mark correctly', () => {
		const { result } = render(textColor);
		expect(result).toContain('colored text');
		expect(result).toContain('color:');
	});

	it('should apply backgroundColor mark correctly', () => {
		const { result } = render(backgroundColor);
		expect(result).toContain('highlighted text');
		expect(result).toContain('background-color:');
	});

	it('should render media single correctly', () => {
		const { result } = render(mediaSingle);
		expect(result).toContain('<img');
		expect(result).toContain('max-width: 100%;');
		expect(result).toContain('max-width: 100%;');
	});

	it('should render media single with pixel sizing fallback correctly', () => {
		const { result } = render(mediaSingleWithPixelSizing);
		expect(result).toContain('<img');
		expect(result).toContain('max-width: 100%;');
		expect(result).toContain('max-width: 100%;');
	});

	it('should render media single with pixel sizing correctly', () => {
		const { result } = render(mediaSingleWithPixelSizing, {}, undefined, 'stage0');
		expect(result).toContain('<img');
		expect(result).toContain('max-width:');
		expect(result).toContain('<img');
	});

	it('should render media group correctly', () => {
		const { result } = render(mediaGroup);
		expect(result).toContain('<img');
		expect(result).toContain('csg-media-lozenge');
	});

	it('should render media inline correctly', () => {
		const { result } = render(mediaInline);
		expect(result).toContain('<img');
		expect(result).toContain('display: inline-block;');
	});

	it('should render media with images inline correctly', () => {
		const { result } = render(mediaInlineImageAllTypes, undefined, mediaContext);
		expect(result).toContain('<img');
		expect(result).toContain('cid:');
	});

	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	it('should render media inline correctly', () => {
		const { result } = render(caption);
		expect(result).toContain('<img');
		expect(result).toContain('<img');
	});

	it('should render decision list correctly', () => {
		const { result, embeddedImages } = render(decisionList);
		expect(result).toContain('decision 1 of 2 in list');
		expect(result).toContain('decision 2 of 2 in list');
		expect(result).toContain('csg-decisionList');
		expectEmbeddedImageIds(embeddedImages, ['csg-icon-decision']);
	});

	it('should render decision list correctly with mock enabled', () => {
		const { result, embeddedImages } = render(decisionList, {
			isImageStubEnabled: true,
		});
		expect(result).toContain('decision 1 of 2 in list');
		expect(result).toContain('decision 2 of 2 in list');
		expect(result).toContain('csg-decisionList');
		expectEmbeddedImageIds(embeddedImages, []);
	});

	it('should render task list correctly', () => {
		const { result, embeddedImages } = render(taskList, undefined, undefined, 'stage0');
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskItem-textTd');
		expectEmbeddedImageIds(embeddedImages, [
			'csg-icon-taskItemUnchecked',
			'csg-icon-taskItemChecked',
		]);
	});

	it('should render task list correctly with mock enabled', () => {
		const { result, embeddedImages } = render(
			taskList,
			{
				isImageStubEnabled: true,
			},
			undefined,
			'stage0',
		);
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskItem-textTd');
		expectEmbeddedImageIds(embeddedImages, []);
	});

	it('should render nested task list correctly', () => {
		const { result, embeddedImages } = render(nestedTaskList, undefined, undefined, 'stage0');
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskList');
		expect(result).toContain('csg-taskItem-textTd');
		expectEmbeddedImageIds(embeddedImages, [
			'csg-icon-taskItemUnchecked',
			'csg-icon-taskItemChecked',
		]);
	});

	it('should render nested task list correctly with mock enabled', () => {
		const { result, embeddedImages } = render(
			nestedTaskList,
			{
				isImageStubEnabled: true,
			},
			undefined,
			'stage0',
		);
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskList');
		expect(result).toContain('csg-taskItem-textTd');
		expectEmbeddedImageIds(embeddedImages, []);
	});

	it('should render block cards correctly', () => {
		const { result } = render(blockCards);
		expect(result).toContain(
			'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424',
		);
		expect(result).toContain('<a');
		expect(result).toContain('href=');
	});

	it('should render inline cards correctly', () => {
		const { result } = render(inlineCards);
		expect(result).toContain(
			'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424',
		);
		expect(result).toContain('<a');
		expect(result).toContain('href=');
	});

	it('should render embed cards correctly', () => {
		const { result } = render(embedCards);
		expect(result).toContain('https://www.dropbox.com/s/abc123/4.txt?dl=0');
		expect(result).toContain('<a');
		expect(result).toContain('href=');
	});

	it('should render text with em inside of a paragraph correctly', () => {
		const { result } = render(em);
		expect(result).toContain('Hello,');
		expect(result).toContain('World!');
		expect(result).toContain('italic');
		expect(result).toContain('underlined text!');
	});

	it('should render panels correctly', () => {
		const { result, embeddedImages } = render(panels);
		expect(result).toContain('csg-panel');
		expect(result).toContain('background:');
		expect(result).toContain('<table');
		expectEmbeddedImageIds(embeddedImages, [
			'csg-icon-info',
			'csg-icon-note',
			'csg-icon-tip',
			'csg-icon-success',
			'csg-icon-warning',
			'csg-icon-error',
		]);
	});

	it('should render panels correctly with mock enabled', () => {
		const { result, embeddedImages } = render(panels, {
			isImageStubEnabled: true,
		});
		expect(result).toContain('csg-panel');
		expect(result).toContain('background:');
		expect(result).toContain('<table');
		expectEmbeddedImageIds(embeddedImages, []);
	});

	it('should align paragraph correctly', () => {
		const { result } = render(paragraphAlign);
		expect(result).toContain('Plain Paragraph');
		expect(result).toContain('Paragraph with center alignment');
		expect(result).toContain('Paragraph with end alignment');
		expect(result).toContain('text-align: center;');
		expect(result).toContain('text-align: right;');
	});

	it('should align heading correctly', () => {
		const { result } = render(headingAlign);
		expect(result).toContain('Heading with center alignment');
		expect(result).toContain('Heading with end alignment');
		expect(result).toContain('text-align: center;');
		expect(result).toContain('text-align: right;');
	});

	it('should render headings 1-6 correctly', () => {
		const { result } = render(heading);
		expect(result).toContain('Heading 1');
		expect(result).toContain('Heading 6');
		expect(result).toContain('<h1');
		expect(result).toContain('<h6');
	});

	it('should inline text properties correctly', () => {
		const { result } = render(inlineTextProps);
		expect(result).toContain('font-size: 14px');
		expect(result).toContain('line-height: 24px');
		expect(result).toContain('font-family');
	});

	it('should inline code properties correctly', () => {
		const { result } = render(inlineCodeProps);
		expect(result).toContain('csg-mark-code');
		expect(result).toContain('font-family');
		expect(result).toContain('background:');
	});

	it('should render codeblock correctly', () => {
		const { result } = render(codeBlock);
		expect(result).toContain('csg-codeBlock-div');
		expect(result).toContain('<pre');
		expect(result).toContain('background-color');
	});

	it('should render mention correctly', () => {
		const { result } = render(mention);
		expect(result).toContain('@Oscar Wallhult');
		expect(result).toContain('data-user-id="1234"');
		expect(result).not.toContain('<a');
	});

	it('should render mention with context', () => {
		const { result } = render(mention, undefined, highlightedMentionNodeContext);
		expect(result).toContain('@Oscar Wallhult');
		expect(result).toContain('csg-mention-highlighted');
		expect(result).toContain('background: #0052CC');
	});

	it('should render paragraph with indentations', () => {
		const { result } = render(paragraphIndents);
		expect(result).toContain('Paragraph with 1 level of indentation');
		expect(result).toContain('padding-left: 30px;');
	});

	it('should render absolute link', () => {
		const { result } = render(link);
		expect(result).toContain('https://www.atlassian.com/');
		expect(result).toContain('<a');
		expect(result).toContain('href=');
	});

	it('should render relative link with baseURL', () => {
		const { result } = render(linkRelative, undefined, baseURLContext);
		expect(result).toContain('href="https://example.com/wiki/atlassian"');
		expect(result).toContain('<a');
	});

	it('should render link with incorrect baseURL', () => {
		const { result } = render(link, undefined, incorrectBaseURLContext);
		expect(result).toContain('https://www.atlassian.com');
		expect(result).toContain('<a');
		expect(result).toContain('href=');
	});

	it('should render text and does not interpret HTML', () => {
		const { result } = render(text);
		expect(result).toContain('&lt;script&gt;');
		expect(result).not.toContain('<script>');
	});

	describe('status', () => {
		// `defaultTestOpts` inlines the stylesheet, so the class is only observable with it off.
		const classNameFor = (text: string) => {
			const { result } = render(status, { isInlineCSSEnabled: false }, undefined, 'stage0');
			const container = document.createElement('div');
			container.innerHTML = result;
			return Array.from(container.querySelectorAll('span'))
				.find((span) => span.textContent === text)
				?.getAttribute('class');
		};

		const classFor = (color: string) => `csg-status-${color.replace('#', '').toLowerCase()}`;

		const ruledClasses = () =>
			new Set(
				Array.from(statusStyles.matchAll(/\.(csg-status-[\w-]+)\s*\{/gu), (match) => match[1]),
			);

		it.each([
			['In progress', 'csg-status-blue'],
			['Neutral', 'csg-status-neutral'],
			['Overdue', 'csg-status-red'],
			['Yellow', 'csg-status-yellow'],
			['Purple', 'csg-status-purple'],
			['Green', 'csg-status-green'],
			['Teal', 'csg-status-b3f5ff'],
			['Accent green', 'csg-status-abf5d1'],
			['Lime', 'csg-status-d3f1a7'],
			['Accent yellow', 'csg-status-fff0b3'],
			['Orange', 'csg-status-fce4a6'],
			['Magenta', 'csg-status-fdd0ec'],
			['Lowercase teal', 'csg-status-b3f5ff'],
			['Unregistered', 'csg-status-neutral'],
			['No colour', 'csg-status-neutral'],
		])('should render the %s status as .%s', (text, className) => {
			expect(classNameFor(text)).toBe(className);
		});

		it('should back every allowed colour with a rule in the stylesheet', () => {
			const ruled = ruledClasses();
			const expected = Array.from(ALLOWED_COLORS, classFor);

			expect(expected.filter((className) => !ruled.has(className))).toEqual([]);
			expect(ruled.size).toBe(expected.length);
		});
	});

	it('should render numbered column for table', () => {
		const { result } = render(tableNumberedColumn);
		expect(result).toContain('<table');
		expect(result).toContain('1');
		expect(result).toContain('2');
	});

	it('should render layout column and sections', () => {
		const { result } = render(layoutColumnSection);
		expect(result).toContain('Lorem ipsum');
		expect(result).toContain('<div');
	});

	it('should render extension placeholders', () => {
		const { result } = render(extensions);
		expect(result).toContain('jira');
		expect(result).toContain('csg-inlineExtension');
	});

	it('should render dates in normal text and task lists', () => {
		const { result } = render(date, undefined, undefined, 'stage0');
		expect(result).toContain('2019');
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('font-size');
	});

	it('should render lists', () => {
		const { result } = render(lists);
		expect(result).toContain('<ul');
		expect(result).toContain('<li');
		expect(result).toContain('list item 1');
	});

	it('should render ordered lists', () => {
		const { result } = render(orderedList);
		expect(result).toContain('<ol');
		expect(result).toContain('<li');
		expect(result).toContain('list item 1');
	});

	it('should render expands', () => {
		const { result } = render(expand);
		expect(result).toContain('<table');
		expect(result).toContain('Title here');
		expect(result).toContain('csg-expand');
	});

	it('should not inline CSS', () => {
		const { result } = render(status, { isInlineCSSEnabled: false });
		expect(result).toContain('In progress');
		expect(result).not.toContain('style=');
	});

	it('should render media based on given context', () => {
		const { result } = render(mediaGroupAllTypes, undefined, mediaContext);
		expect(result).toContain('<img');
		expect(result).toContain('cid:');
	});

	it('should render media inline based on given context', () => {
		const { result } = render(mediaInlineAllTypes, undefined, mediaContext);
		expect(result).toContain('<img');
		expect(result).toContain('cid:');
		expect(result).toContain('display: inline-block;');
	});

	it('should render list inside a blockquote', () => {
		const { result } = render(blockquoteWithList, undefined, mediaContext);
		expect(result).toContain('<blockquote');
		expect(result).toContain('<ul');
		expect(result).toContain('<li');
	});

	it('should render actions inside list', () => {
		const { result } = render(actionInsideList, undefined, mediaContext);
		expect(result).toContain('<ul');
		expect(result).toContain('<li');
		expect(result).toContain('csg-p');
	});

	it('should render action, code-block, decision, media, rule inside panel', () => {
		const { result } = render(extendedPanel, undefined, mediaContext, 'stage0');
		expect(result).toContain('csg-panel');
		expect(result).toContain('csg-p');
		expect(result).toContain('<img');
		expect(result).toContain('csg-codeBlock-div');
		expect(result).toContain('csg-panel');
	});

	it('should render list, action, code-block, panel, quote, decision, rule inside nested expand', () => {
		const { result } = render(nestedExpand, undefined, mediaContext, 'stage0');
		expect(result).toContain('<table');
		expect(result).toContain('<ul');
		expect(result).toContain('csg-p');
		expect(result).toContain('<blockquote');
		expect(result).toContain('<ul');
	});

	it('should render nestedExpand nested in expand', () => {
		const { result } = render(nestedExpandInExpand);
		expect(result).toContain('<table');
		expect(result).toContain('csg-expand');
		expect(result).toContain('<table');
	});

	it('should render codeblock nested in quote', () => {
		const { result } = render(codeblockInQuote);
		expect(result).toContain('<blockquote');
		expect(result).toContain('csg-codeBlock-div');
		expect(result).toContain('<pre');
	});

	it('should render mediaSingle nested in quote', () => {
		const { result } = render(mediaSingleInQuote);
		expect(result).toContain('<blockquote');
		expect(result).toContain('<img');
	});

	it('should render mediaGroup nested in quote', () => {
		const { result } = render(mediaGroupInQuote);
		expect(result).toContain('<blockquote');
		expect(result).toContain('<img');
	});

	it('should render images via URL when external rendering enabled', () => {
		const { result } = render(mediaSingleExternalImage, undefined, { renderExternalImages: true });
		expect(result).toContain('<img');
		expect(result).toContain('src="https://');
	});

	it('should transform and render nested table extension correctly', () => {
		const { result } = render(nestedTables);
		expect(result).toContain('<table');
		expect(result).toContain('<table');
		expect(result).toContain('<tbody');
	});

	it('should render original ADF if nested table extension transformer fails', () => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const { result } = render(nestedTablesInvalid);
		expect(result).toContain('<table');
		expect(result).toContain('<table');
		expect(result).toContain('nested-table');
		consoleErrorMock.mockRestore();
	});

	it('should render redaction inlineExtension correctly', () => {
		const { result } = render(redaction);
		expect(result).toContain('redaction');
		expect(result).toContain('csg-inlineExtension');
	});

	it('should render bodiedSyncBlock content correctly', () => {
		const { result } = render(bodiedSyncBlock);
		expect(result).toContain('Content before sync block');
		expect(result).toContain('Content after sync block');
	});

	it('should render syncBlock correctly', () => {
		const { result } = render(syncBlock);
		expect(result).toContain('Content before sync block');
		expect(result).toContain('Content after sync block');
	});

	it('should render hidden-markers list (wrapper bullet and ordered list items) correctly', () => {
		const { result } = render(hiddenMarkersList);
		expect(result).toContain('<ul');
		expect(result).toContain('<ol');
		expect(result).not.toContain('data-marker');
	});

	it('should render hidden-markers mixed list (task lists inside bullet/ordered lists) correctly', () => {
		const { result, embeddedImages } = render(hiddenMarkersMixedList);
		expect(result).toContain('<ul');
		expect(result).toContain('csg-taskItem');
		expect(result).not.toContain('data-marker');
		expectEmbeddedImageIds(embeddedImages, [
			'csg-icon-taskItemUnchecked',
			'csg-icon-taskItemChecked',
		]);
	});

	it('should render hidden-markers task list (nested task lists with wrappers) correctly', () => {
		const { result, embeddedImages } = render(hiddenMarkersTaskList);
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskItem');
		expect(result).not.toContain('data-marker');
		expectEmbeddedImageIds(embeddedImages, [
			'csg-icon-taskItemUnchecked',
			'csg-icon-taskItemChecked',
		]);
	});

	it('should render task list deeply nested inside bullet and ordered list wrappers correctly', () => {
		const { result, embeddedImages } = render(taskListDeepNesting);
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskList');
		expect(result).toContain('csg-taskItem-textTd');
		expectEmbeddedImageIds(embeddedImages, [
			'csg-icon-taskItemUnchecked',
			'csg-icon-taskItemChecked',
		]);
	});

	it('should render task list with mixed TODO and DONE states across nesting levels correctly', () => {
		const { result, embeddedImages } = render(taskListMixedStates);
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-taskItem-textTd');
		expectEmbeddedImageIds(embeddedImages, [
			'csg-icon-taskItemChecked',
			'csg-icon-taskItemUnchecked',
		]);
	});

	it('should render task list items with rich inline content (bold, italic, links, code) correctly', () => {
		const { result, embeddedImages } = render(taskListRichContent);
		expect(result).toContain('csg-taskItem');
		expect(result).toContain('csg-mark-strong');
		expect(result).toContain('csg-mark-em');
		expect(result).toContain('csg-mark-code');
		expectEmbeddedImageIds(embeddedImages, [
			'csg-icon-taskItemUnchecked',
			'csg-icon-taskItemChecked',
		]);
	});
});
