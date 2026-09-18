/* eslint-disable @atlaskit/volt-strict-mode/no-re-exports -- These should be re-exported as they are an external dependency */

export type {
	MarkSerializer,
	MarkSerializerSpec,
	NodeSerializerSpec,
	NodeSerializer,
} from 'prosemirror-markdown';

export {
	MarkdownParser,
	MarkdownSerializer,
	MarkdownSerializerState,
	defaultMarkdownParser,
	defaultMarkdownSerializer,
} from 'prosemirror-markdown';
