import { snapshot } from '@af/visual-regression';
import {
	CodeBlockInBlockquote,
	CodeBlockInBlockquoteCopy,
	CodeBlockInBlockquoteWrap,
	CodeBlockInBlockquoteCopyWrap,
	CodeBlockOverflowInBlockquote,
	CodeBlockWithReactLooselyLazy,
} from './code-block-in-blockquote.fixture';

snapshot(CodeBlockInBlockquote, {
	description: 'should render codeblock inside blockquote',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(CodeBlockOverflowInBlockquote, {
	description: 'should render codeblock with overflow inside blockquote',
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(CodeBlockInBlockquoteCopy, {
	description: 'should render copy button on hover for codeblock inside blockquote',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(CodeBlockInBlockquoteWrap, {
	description: 'should render wrap button on hover for codeblock inside blockquote',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(CodeBlockInBlockquoteCopyWrap, {
	description: 'should render copy and wrap button on hover for codeblock inside blockquote',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
	variants: [
		{
			name: 'default',
			environment: {},
		},
		{
			name: 'light mode',
			environment: {
				colorScheme: 'light',
			},
		},
	],
});

snapshot(CodeBlockWithReactLooselyLazy, {
	description: 'should render codeblock inside blockquote with react loosely lazy',
});
