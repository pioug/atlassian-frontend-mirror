import React from 'react';

import { render } from '@testing-library/react';

import { axe } from '@af/accessibility-testing';

import BasicCodeBlockExample from '../../../examples/00-basic';
import BasicInlineCodeExample from '../../../examples/01-inline-code-basic';
import CodeBlockHighlightingExample from '../../../examples/14-code-block-highlighting-long-lines';
import { CodeBlock } from '../../index';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('CodeBlock Accessibility jest-axe', () => {
	const props = {
		shouldShowLineNumbers: true,
		highlight: '',
		highlightedStartText: 'Highlight start',
		highlightedEndText: 'Highlight end',
		text: 'text',
		hasBidiWarnings: true,
		codeBidiWarningLabel: 'warning label',
		isBidiWarningTooltipEnabled: true,
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
