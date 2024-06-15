import React from 'react';

import { render, screen } from '@testing-library/react';

import { characters } from '../../../examples/example-data/bidi-examples';
import CodeBidiWarning from '../../bidi-warning';

describe('CodeBidiWarning', () => {
	test('Cosmetic decoration is visible to sighted users, but ignored by accessibility software', () => {
		render(<CodeBidiWarning bidiCharacter={characters.u202e} testId="test" />);

		const visibleSpan = screen.getByTestId('test');
		expect(visibleSpan).toBeVisible();
		expect(visibleSpan).toHaveAttribute('aria-hidden');
	});

	test('Decoration text is able to be announced to non visual users, but is visually hidden', () => {
		render(<CodeBidiWarning bidiCharacter={characters.u202e} testId="test" />);

		const bidiCharacterCode = `U+${characters.u202e.codePointAt(0)?.toString(16)}`;
		const decorationText = screen.getByText(bidiCharacterCode);
		expect(decorationText).toBeInTheDocument();

		const visuallyHiddenMark = screen.getByTestId('test--visually-hidden');
		// we can't test not.toBeVisible as our visually hidden styles don't match the
		// requirements for the matcher
		expect(visuallyHiddenMark).toHaveStyle({
			width: '1px',
			height: '1px',
			padding: 0,
			position: 'absolute',
			border: '0',
			clip: 'rect(1px, 1px, 1px, 1px)',
			overflow: 'hidden',
			'white-space': 'nowrap',
		});
	});
});
