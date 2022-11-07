import React from 'react';
import { act, fireEvent, screen } from '@testing-library/react';
import {
  mockReactDomWarningGlobal,
  renderWithIntl,
} from '../../_testing-library';
import { spriteEmoji, imageEmoji } from '../../_test-data';
import EmojiButton, {
  Props as EmojiButtonProps,
} from '../../../../components/common/EmojiButton';

describe('<EmojiButton />', () => {
  mockReactDomWarningGlobal();

  const renderEmojiButton = (customProps: Partial<EmojiButtonProps> = {}) =>
    renderWithIntl(<EmojiButton emoji={spriteEmoji} {...customProps} />);

  describe('as sprite', () => {
    it('should call onClick on click', async () => {
      const mockOnClickSpy = jest.fn();
      renderEmojiButton({
        emoji: spriteEmoji,
        onSelected: mockOnClickSpy,
      });
      const btn = await screen.findByRole('button');
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
      renderEmojiButton({
        emoji: imageEmoji,
        onSelected: mockOnClickSpy,
      });
      const btn = await screen.findByRole('button');
      expect(btn).toBeInTheDocument();
      act(() => {
        fireEvent.mouseDown(btn);
      });
      expect(mockOnClickSpy).toBeCalled();
    });
  });
});
