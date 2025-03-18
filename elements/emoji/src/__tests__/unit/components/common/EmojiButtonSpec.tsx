import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import { mockReactDomWarningGlobal, renderWithIntl } from '../../_testing-library';
import { spriteEmoji, imageEmoji } from '../../_test-data';
import { default as EmotionEmojiRadioButton } from '../../../../components/common/EmojiRadioButton';
import { default as CompiledEmojiRadioButton } from '../../../../components/compiled/common/EmojiRadioButton';
import { type Props as EmojiRadioButtonProps } from '../../../../components/common/EmojiRadioButton';

// cleanup `platform_editor_css_migrate_emoji`: delete "off" version and delete this outer describe
describe('platform_editor_css_migrate_emoji "on" - compiled', () => {
	describe('<EmojiButton />', () => {
		mockReactDomWarningGlobal();

		const renderEmojiRadioButton = (customProps: Partial<EmojiRadioButtonProps> = {}) =>
			renderWithIntl(<CompiledEmojiRadioButton emoji={spriteEmoji} {...customProps} />);

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
});

describe('platform_editor_css_migrate_emoji "off" - emotion', () => {
	describe('<EmojiButton />', () => {
		mockReactDomWarningGlobal();

		const renderEmojiRadioButton = (customProps: Partial<EmojiRadioButtonProps> = {}) =>
			renderWithIntl(<EmotionEmojiRadioButton emoji={spriteEmoji} {...customProps} />);

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
});
