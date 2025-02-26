import type { EmailSerializerOpts, MetaDataContext } from '../../interfaces';
import EmailSerializer from '../..';
import { defaultSchema, getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';
import MockDate from 'mockdate';

import * as paragraphIndents from './__fixtures__/paragraph-indents.adf.json';
import * as paragraphAlign from './__fixtures__/paragraph-align.adf.json';
import * as heading from './__fixtures__/heading.adf.json';
import * as headingAlign from './__fixtures__/heading-align.adf.json';
import * as em from './__fixtures__/em.adf.json';
import * as codeBlock from './__fixtures__/code-block.adf.json';
import * as mention from './__fixtures__/mention.adf.json';
import * as inlineCodeProps from './__fixtures__/inline-code-props.adf.json';
import * as inlineTextProps from './__fixtures__/inline-text-props.adf.json';
import * as panels from './__fixtures__/panels.adf.json';
import * as link from './__fixtures__/link.adf.json';
import * as linkRelative from './__fixtures__/link-relative.adf.json';
import * as decisionList from './__fixtures__/decision-list.adf.json';
import * as taskList from './__fixtures__/task-list.adf.json';
import * as nestedTaskList from './__fixtures__/nested-task-list.adf.json';
import * as blockCards from './__fixtures__/block-cards.adf.json';
import * as inlineCards from './__fixtures__/inline-cards.adf.json';
import * as embedCards from './__fixtures__/embed-cards.adf.json';
import * as status from './__fixtures__/status.adf.json';
import * as tableNumberedColumn from './__fixtures__/table-numbered-column.adf.json';
import * as layoutColumnSection from './__fixtures__/layout-column-section.adf.json';
import * as extensions from './__fixtures__/extensions.adf.json';
import * as date from './__fixtures__/date.adf.json';
import * as mediaSingle from './__fixtures__/media-single.adf.json';
import * as mediaSingleWithPixelSizing from './__fixtures__/media-single-pixel-sizing.adf.json';
import * as mediaGroup from './__fixtures__/media-group.adf.json';
import * as mediaGroupAllTypes from './__fixtures__/media-group-all-types.adf.json';
import * as mediaInline from './__fixtures__/media-inline.adf.json';
import * as caption from './__fixtures__/caption.adf.json';
import * as mediaInlineAllTypes from './__fixtures__/media-inline-all-types.adf.json';
import * as mediaInlineImageAllTypes from './__fixtures__/media-inline-image-all-types.adf.json';
import * as lists from './__fixtures__/lists.adf.json';
import * as orderedList from './__fixtures__/ordered-list.adf.json';
import * as text from './__fixtures__/text.adf.json';
import * as expand from './__fixtures__/expand.adf.json';
import * as textColor from './__fixtures__/text-color.adf.json';
import * as backgroundColor from './__fixtures__/background-color.adf.json';

import * as image from './__fixtures__/image.adf.json';
import * as placeholder from './__fixtures__/placeholder.adf.json';
import * as annotation from './__fixtures__/annotation.adf.json';
import * as breakout from './__fixtures__/breakout.adf.json';
import * as blockquoteWithList from './__fixtures__/blockquote-with-list.json';
import * as actionInsideList from './__fixtures__/action-inside-list.adf.json';
import * as extendedPanel from './__fixtures__/extended-panel.adf.json';
import * as nestedExpand from './__fixtures__/extended-nested-expand.adf.json';
import * as nestedExpandInExpand from './__fixtures__/nested-expand-in-expand.adf.json';
import * as codeblockInQuote from './__fixtures__/codeblock-in-quote.adf.json';
import * as mediaSingleInQuote from './__fixtures__/media-single-in-quote.adf.json';
import * as mediaGroupInQuote from './__fixtures__/media-group-in-quote.adf.json';
import * as nestedTables from './__fixtures__/nested-tables-extension.adf.json';
import * as nestedTablesInvalid from './__fixtures__/nested-tables-extension-invalid.adf.json';
import * as redaction from './__fixtures__/redaction-extension.adf.json';

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
		result: node.firstChild,
		embeddedImages,
	};
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
		expect(result).toMatchSnapshot('html');
	});

	it('should render nothing for placeholder node', () => {
		const { result } = render(placeholder);
		expect(result).toMatchSnapshot('html');
	});

	it('should apply no mark for annotation marks', () => {
		const { result } = render(annotation);
		expect(result).toMatchSnapshot('html');
	});

	it('should apply no mark for breakout marks', () => {
		const { result } = render(breakout);
		expect(result).toMatchSnapshot('html');
	});

	it('should apply textColor mark correctly', () => {
		const { result } = render(textColor);
		expect(result).toMatchSnapshot('html');
	});

	it('should apply backgroundColor mark correctly', () => {
		const { result } = render(backgroundColor);
		expect(result).toMatchSnapshot('html');
	});

	it('should render media single correctly', () => {
		const { result } = render(mediaSingle);
		expect(result).toMatchSnapshot('html');
	});

	it('should render media single with pixel sizing fallback correctly', () => {
		const { result } = render(mediaSingleWithPixelSizing);
		expect(result).toMatchSnapshot('html');
	});

	it('should render media single with pixel sizing correctly', () => {
		const { result } = render(mediaSingleWithPixelSizing, {}, undefined, 'stage0');
		expect(result).toMatchSnapshot('html');
	});

	it('should render media group correctly', () => {
		const { result } = render(mediaGroup);
		expect(result).toMatchSnapshot('html');
	});

	it('should render media inline correctly', () => {
		const { result } = render(mediaInline);
		expect(result).toMatchSnapshot('html');
	});

	it('should render media with images inline correctly', () => {
		const { result } = render(mediaInlineImageAllTypes, undefined, mediaContext);
		expect(result).toMatchSnapshot('html');
	});

	// Ignored via go/ees005
	// eslint-disable-next-line jest/no-identical-title
	it('should render media inline correctly', () => {
		const { result } = render(caption);
		expect(result).toMatchSnapshot('html');
	});

	it('should render decision list correctly', () => {
		const { result, embeddedImages } = render(decisionList);
		expect(result).toMatchSnapshot('html');
		expect(embeddedImages).toMatchSnapshot('embeddedImages');
	});

	it('should render decision list correctly with mock enabled', () => {
		const { result, embeddedImages } = render(decisionList, {
			isImageStubEnabled: true,
		});
		expect(result).toMatchSnapshot('mock-html');
		expect(embeddedImages).toMatchSnapshot('mock-embeddedImages');
	});

	it('should render task list correctly', () => {
		const { result, embeddedImages } = render(taskList);
		expect(result).toMatchSnapshot('html');
		expect(embeddedImages).toMatchSnapshot('embeddedImages');
	});

	it('should render task list correctly with mock enabled', () => {
		const { result, embeddedImages } = render(taskList, {
			isImageStubEnabled: true,
		});
		expect(result).toMatchSnapshot('mock-html');
		expect(embeddedImages).toMatchSnapshot('mock-embeddedImages');
	});

	it('should render nested task list correctly', () => {
		const { result, embeddedImages } = render(nestedTaskList);
		expect(result).toMatchSnapshot('html');
		expect(embeddedImages).toMatchSnapshot('embeddedImages');
	});

	it('should render nested task list correctly with mock enabled', () => {
		const { result, embeddedImages } = render(nestedTaskList, {
			isImageStubEnabled: true,
		});
		expect(result).toMatchSnapshot('mock-html');
		expect(embeddedImages).toMatchSnapshot('mock-embeddedImages');
	});

	it('should render block cards correctly', () => {
		const { result } = render(blockCards);
		expect(result).toMatchSnapshot('html');
	});

	it('should render inline cards correctly', () => {
		const { result } = render(inlineCards);
		expect(result).toMatchSnapshot('html');
	});

	it('should render embed cards correctly', () => {
		const { result } = render(embedCards);
		expect(result).toMatchSnapshot('html');
	});

	it('should render text with em inside of a paragraph correctly', () => {
		const { result } = render(em);
		expect(result).toMatchSnapshot('html');
	});

	it('should render panels correctly', () => {
		const { result, embeddedImages } = render(panels);
		expect(result).toMatchSnapshot('html');
		expect(embeddedImages).toMatchSnapshot('embeddedImages');
	});

	it('should render panels correctly with mock enabled', () => {
		const { result, embeddedImages } = render(panels, {
			isImageStubEnabled: true,
		});
		expect(result).toMatchSnapshot('mock-html');
		expect(embeddedImages).toMatchSnapshot('mock-embeddedImages');
	});

	it('should align paragraph correctly', () => {
		const { result } = render(paragraphAlign);
		expect(result).toMatchSnapshot('html');
	});

	it('should align heading correctly', () => {
		const { result } = render(headingAlign);
		expect(result).toMatchSnapshot('html');
	});

	it('should render headings 1-6 correctly', () => {
		const { result } = render(heading);
		expect(result).toMatchSnapshot('html');
	});

	it('should inline text properties correctly', () => {
		const { result } = render(inlineTextProps);
		expect(result).toMatchSnapshot('html');
	});

	it('should inline code properties correctly', () => {
		const { result } = render(inlineCodeProps);
		expect(result).toMatchSnapshot('html');
	});

	it('should render codeblock correctly', () => {
		const { result } = render(codeBlock);
		expect(result).toMatchSnapshot('html');
	});

	it('should render mention correctly', () => {
		const { result } = render(mention);
		expect(result).toMatchSnapshot('html');
	});

	it('should render mention with context', () => {
		const { result } = render(mention, undefined, highlightedMentionNodeContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render paragraph with indentations', () => {
		const { result } = render(paragraphIndents);
		expect(result).toMatchSnapshot('html');
	});

	it('should render absolute link', () => {
		const { result } = render(link);
		expect(result).toMatchSnapshot('html');
	});

	it('should render relative link with baseURL', () => {
		const { result } = render(linkRelative, undefined, baseURLContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render link with incorrect baseURL', () => {
		const { result } = render(link, undefined, incorrectBaseURLContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render text and does not interpret HTML', () => {
		const { result } = render(text);
		expect(result).toMatchSnapshot('html');
	});

	it('should render status correctly', () => {
		const { result } = render(status);
		expect(result).toMatchSnapshot('html');
	});

	it('should render numbered column for table', () => {
		const { result } = render(tableNumberedColumn);
		expect(result).toMatchSnapshot('html');
	});

	it('should render layout column and sections', () => {
		const { result } = render(layoutColumnSection);
		expect(result).toMatchSnapshot('html');
	});

	it('should render extension placeholders', () => {
		const { result } = render(extensions);
		expect(result).toMatchSnapshot('html');
	});

	it('should render dates in normal text and task lists', () => {
		const { result } = render(date);
		expect(result).toMatchSnapshot('html');
	});

	it('should render lists', () => {
		const { result } = render(lists);
		expect(result).toMatchSnapshot('html');
	});

	it('should render ordered lists', () => {
		const { result } = render(orderedList);
		expect(result).toMatchSnapshot('html');
	});

	it('should render expands', () => {
		const { result } = render(expand);
		expect(result).toMatchSnapshot('html');
	});

	it('should not inline CSS', () => {
		const { result } = render(status, { isInlineCSSEnabled: false });
		expect(result).toMatchSnapshot('html');
	});

	it('should render media based on given context', () => {
		const { result } = render(mediaGroupAllTypes, undefined, mediaContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render media inline based on given context', () => {
		const { result } = render(mediaInlineAllTypes, undefined, mediaContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render list inside a blockquote', () => {
		const { result } = render(blockquoteWithList, undefined, mediaContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render actions inside list', () => {
		const { result } = render(actionInsideList, undefined, mediaContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render action, code-block, decision, media, rule inside panel', () => {
		const { result } = render(extendedPanel, undefined, mediaContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render list, action, code-block, panel, quote, decision, rule inside nested expand', () => {
		const { result } = render(nestedExpand, undefined, mediaContext);
		expect(result).toMatchSnapshot('html');
	});

	it('should render nestedExpand nested in expand', () => {
		const { result } = render(nestedExpandInExpand);
		expect(result).toMatchSnapshot('nestedExpand in expand');
	});

	it('should render codeblock nested in quote', () => {
		const { result } = render(codeblockInQuote);
		expect(result).toMatchSnapshot('codeblock in quote');
	});

	it('should render mediaSingle nested in quote', () => {
		const { result } = render(mediaSingleInQuote);
		expect(result).toMatchSnapshot('mediaSingle in quote');
	});

	it('should render mediaGroup nested in quote', () => {
		const { result } = render(mediaGroupInQuote);
		expect(result).toMatchSnapshot('mediaGroup in quote');
	});

	it('should transform and render nested table extension correctly', () => {
		const { result } = render(nestedTables);
		expect(result).toMatchSnapshot('nested tables extension');
	});

	it('should render original ADF if nested table extension transformer fails', () => {
		const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});
		const { result } = render(nestedTablesInvalid);
		expect(result).toMatchSnapshot('nested tables extension invalid');
		consoleErrorMock.mockRestore();
	});

	it('should render redaction inlineExtension correctly', () => {
		const { result } = render(redaction);
		expect(result).toMatchSnapshot('redaction extension');
	});
});
