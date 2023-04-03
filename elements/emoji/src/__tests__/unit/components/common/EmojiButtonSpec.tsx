import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
} from '../../_testing-library';
import { spriteEmoji, imageEmoji } from '../../_test-data';
import EmojiRadioButton, {
  Props as EmojiRadioButtonProps,
} from '../../../../components/common/EmojiRadioButton';

describe('<EmojiButton />', () => {
  mockReactDomWarningGlobal();

  const renderEmojiRadioButton = (
    customProps: Partial<EmojiRadioButtonProps> = {},
  ) =>
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
