import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import BasicCodeBlockExample from '../../../examples/00-basic';
import BasicInlineCodeExample from '../../../examples/01-inline-code-basic';
import CodeBlockHighlightingExample from '../../../examples/14-code-block-highlighting-long-lines';
import { CodeBlock } from '../../index';

describe('CodeBlock Accessibility jest-axe', () => {
	const props = {
		showLineNumbers: true,
		highlight: '',
		highlightedStartText: 'Highlight start',
		highlightedEndText: 'Highlight end',
		text: 'text',
		codeBidiWarnings: true,
		codeBidiWarningLabel: 'warning label',
		codeBidiWarningTooltipEnable: true,
		shouldWrapLongLines: false,
	};

	it('CodeBlock should not fail an aXe audit', async () => {
		const { container } = render(<CodeBlock {...props} />);
		await axe(container);
	});

	it('CodeBlock example using highlighting and bidi highlighting should not fail aXe audit', async () => {
		const { container } = render(<BasicCodeBlockExample />);
		await axe(container);
	});

	it('Inline Code example should not fail aXe audit', async () => {
		const { container } = render(<BasicInlineCodeExample />);
		await axe(container);
	});

	it('CodeBlock highlighting lines example should not fail aXe audit', async () => {
		const { container } = render(<CodeBlockHighlightingExample />);
		await axe(container);
	});
});
