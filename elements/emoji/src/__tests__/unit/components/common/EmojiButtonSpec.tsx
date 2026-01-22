import { skipAutoA11yFile } from '@atlassian/a11y-jest-testing';
import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../_testing-library';
import { spriteEmoji, imageEmoji } from '../../_test-data';
import EmojiRadioButton from '../../../../components/common/EmojiRadioButton';
import { type Props as EmojiRadioButtonProps } from '../../../../components/common/EmojiRadioButton';

// This file exposes one or more accessibility violations. Testing is currently skipped but violations need to
// be fixed in a timely manner or result in escalation. Once all violations have been fixed, you can remove
// the next line and associated import. For more information, see go/afm-a11y-tooling:jest
skipAutoA11yFile();

describe('<EmojiButton />', () => {
	mockReactDomWarningGlobal();

	const renderEmojiRadioButton = (customProps: Partial<EmojiRadioButtonProps> = {}) =>
		renderWithIntl(<EmojiRadioButton emoji={spriteEmoji} {...customProps} />);

	describe('as sprite', () => {
		it('should call onClick on click', async () => {
			const mockOnClickSpy = jest.fn();
			renderEmojiRadioButton({
				emoji: spriteEmoji,
				onSelected: mockOnClickSpy,
			});
			const btn = await screen.findByRole('radio');
			expect(btn).toBeInTheDocument();
			act(() => {
				fireEvent.mouseDown(btn);
			});
			expect(mockOnClickSpy).toBeCalled();
		});
	});

	describe('as image', () => {
		it('should call onClick on click', async () => {
			const mockOnClickSpy = jest.fn();
			renderEmojiRadioButton({
				emoji: imageEmoji,
				onSelected: mockOnClickSpy,
			});
			const btn = await screen.findByRole('radio');
			expect(btn).toBeInTheDocument();
			act(() => {
				fireEvent.mouseDown(btn);
			});
			expect(mockOnClickSpy).toBeCalled();
		});
	});
});
