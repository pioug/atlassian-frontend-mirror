import React from 'react';
import Emoji from '../../../../components/common/Emoji';
import { spriteEmoji, imageEmoji } from '../../_test-data';
import { commonSelectedStyles } from '../../../../components/common/styles';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

describe('<Emoji />', () => {
  describe('as sprite', () => {
    it('should use spritesheet if present', async () => {
      const result = await render(<Emoji emoji={spriteEmoji} />);
      const component = result.getByTestId(
        `sprite-emoji-${spriteEmoji.shortName}`,
      );
      expect(component.firstChild).toHaveStyle(
        `background-image: url(https://path-to-spritesheet.png)`,
      );
    });

    it('should use percentage for background-position', async () => {
      const result = await render(<Emoji emoji={spriteEmoji} />);
      const component = result.getByTestId(
        `sprite-emoji-${spriteEmoji.shortName}`,
      );
      expect(component.firstChild).toHaveStyle(`background-position: 20% 20%`);
    });

    it('should use zoom the background image', async () => {
      const result = await render(<Emoji emoji={spriteEmoji} />);
      const component = result.getByTestId(
        `sprite-emoji-${spriteEmoji.shortName}`,
      );
      expect(component.firstChild).toHaveStyle(`background-size: 600% 600%`);
    });

    it('should be selected', async () => {
      const result = await render(
        <Emoji emoji={spriteEmoji} selected={true} />,
      );
      const component = result.getByTestId(
        `sprite-emoji-${spriteEmoji.shortName}`,
      );
      expect(component).toHaveClass(commonSelectedStyles);
    });

    it('should be wrapped in a tooltip if showTooltip is set to true', async () => {
      const result = await render(
        <Emoji emoji={spriteEmoji} showTooltip={true} />,
      );
      expect(result.getByTitle(':grimacing:')).toBeDefined();
    });

    it('should not be wrapped in a tooltip if showTooltip is not set', async () => {
      const result = await render(<Emoji emoji={spriteEmoji} />);
      const component = result.getByTestId(
        `sprite-emoji-${spriteEmoji.shortName}`,
      );
      expect(component.getAttribute('title')).toBe('');
    });
  });

  describe('as image', () => {
    it('should show lazy load placeholder when not loaded', async () => {
      const result = await render(<Emoji emoji={imageEmoji} />);
      mockAllIsIntersecting(false);
      const image = result.queryByAltText(imageEmoji.shortName);
      expect(image).toBeNull();
      const placeholder = result.getByTestId(
        `emoji-placeholder-${spriteEmoji.shortName}`,
      );
      expect(placeholder).toBeDefined();
    });
    it('should use image by default', async () => {
      const result = await render(<Emoji emoji={imageEmoji} />);
      mockAllIsIntersecting(true);
      const image = result.getByAltText(imageEmoji.shortName);
      expect(image).toHaveAttribute('src', 'https://path-to-image.png');
    });

    it('should have emoji class', async () => {
      const result = await render(<Emoji emoji={imageEmoji} />);
      mockAllIsIntersecting(true);
      const image = result.getByAltText(imageEmoji.shortName);
      expect(image).toHaveClass('emoji');
    });

    it('should have "data-emoji-short-name" attribute', async () => {
      const result = await render(<Emoji emoji={imageEmoji} />);
      mockAllIsIntersecting(true);
      const image = result.getByAltText(imageEmoji.shortName);
      expect(image).toHaveAttribute('data-emoji-short-name', ':grimacing:');
    });

    it('should use altRepresentation image if fitToHeight is larger than representation height', async () => {
      const result = await render(
        <Emoji emoji={imageEmoji} fitToHeight={26} />,
      );
      mockAllIsIntersecting(true);
      const image = result.getByAltText(imageEmoji.shortName);
      expect(image).toHaveAttribute('src', 'https://alt-path-to-image.png');
    });

    it('should be selected', async () => {
      const result = render(<Emoji emoji={imageEmoji} selected={true} />);
      mockAllIsIntersecting(true);
      const imageWrapper = result.getByTestId(
        `image-emoji-${imageEmoji.shortName}`,
      );
      expect(imageWrapper).toHaveClass(commonSelectedStyles);
    });

    it('should be wrapped in a tooltip if showTooltip is set to true', async () => {
      const result = render(<Emoji emoji={imageEmoji} showTooltip={true} />);
      const imageWrapper = result.getByTestId(
        `image-emoji-${imageEmoji.shortName}`,
      );
      expect(imageWrapper).toHaveAttribute('title', ':grimacing:');
    });

    it('should not be wrapped in a tooltip if showTooltip is not set', async () => {
      const result = render(<Emoji emoji={imageEmoji} />);
      const imageWrapper = result.getByTestId(
        `image-emoji-${imageEmoji.shortName}`,
      );
      expect(imageWrapper).toHaveAttribute('title', '');
    });

    it('should show delete button is showDelete is passed in', async () => {
      const result = await render(
        <Emoji emoji={imageEmoji} showDelete={true} />,
      );
      const deleteBtn = result.getByTestId('emoji-delete-button');
      expect(deleteBtn).toBeDefined();
    });

    it('should not show delete button if showDelete is not passed in', async () => {
      const result = await render(<Emoji emoji={imageEmoji} />);
      expect(result.queryByTestId('emoji-delete-button')).toBeNull();
    });
  });
});
