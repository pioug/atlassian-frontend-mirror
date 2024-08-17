import { snapshotInformational } from '@af/visual-regression';
import { CodeBlockRendererLayout, CodeBlockRendererQuote } from './code-block.fixture';

snapshotInformational(CodeBlockRendererLayout, {
	selector: { byTestId: 'renderer-code-block' },
	description:
		'should render copy and wrap buttons on hover for a codeblock nested inside a layout',
	states: [{ state: 'hovered', selector: { byTestId: 'renderer-code-block' } }],
});

snapshotInformational(CodeBlockRendererQuote, {
	description:
		'should render copy and wrap buttons on hover for a codeblock nested inside a blockquote',
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
		{
			name: 'dark mode',
			environment: {
				colorScheme: 'dark',
			},
		},
	],
});
