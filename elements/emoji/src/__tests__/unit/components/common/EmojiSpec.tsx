import React from 'react';
import { fireEvent } from '@testing-library/react';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';
import { axe, toHaveNoViolations } from 'jest-axe';
import { default as EmotionEmoji } from '../../../../components/common/Emoji';
import { default as CompiledEmoji } from '../../../../components/compiled/common/Emoji';
import { spriteEmoji, imageEmoji } from '../../_test-data';
import { commonSelectedStyles } from '../../../../components/common/styles';
import browserSupport from '../../../../util/browser-support';
import { RENDER_EMOJI_DELETE_BUTTON_TESTID } from '../../../../components/common/DeleteButton';

import '@testing-library/jest-dom';
import { renderWithIntl } from '../../_testing-library';

// Add matcher provided by 'jest-axe'
expect.extend(toHaveNoViolations);

describe('<Emoji />', () => {
	beforeAll(() => {
		browserSupport.supportsIntersectionObserver = true;
	});

	// cleanup `platform_editor_css_migrate_emoji`: delete "off" version and delete this outer describe
	describe('platform_editor_css_migrate_emoji "on" - compiled', () => {
		describe('as sprite', () => {
			it('should use spritesheet if present', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component.firstChild).toHaveStyle(
					`background-image: url(https://path-to-spritesheet.png)`,
				);
			});

			it('should use percentage for background-position', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component.firstChild).toHaveStyle(`background-position: 20% 20%`);
			});

			it('should use zoom the background image', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component.firstChild).toHaveStyle(`background-size: 600% 600%`);
			});

			it('should be selected', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={spriteEmoji} selected={true} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component).toHaveClass(commonSelectedStyles);
			});

			it('should be wrapped in a tooltip if showTooltip is set to true', async () => {
				const result = await renderWithIntl(
					<CompiledEmoji emoji={spriteEmoji} showTooltip={true} />,
				);
				expect(result.getByTitle(':grimacing:')).toBeDefined();
			});

			it('should not be wrapped in a tooltip if showTooltip is not set', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component).not.toHaveAttribute('title');
			});
		});

		describe('as image', () => {
			it('should use image by default', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} />);
				mockAllIsIntersecting(true);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('src', 'https://path-to-image.png');
			});

			it('should have emoji class', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} />);
				mockAllIsIntersecting(true);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveClass('emoji');
			});

			it('should have "data-emoji-short-name" attribute', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} />);
				mockAllIsIntersecting(true);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('data-emoji-short-name', ':grimacing:');
			});

			it('should use altRepresentation image if fitToHeight is larger than representation height', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} fitToHeight={26} />);
				mockAllIsIntersecting(true);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('src', 'https://alt-path-to-image.png');
			});

			it('should be selected', async () => {
				const result = renderWithIntl(<CompiledEmoji emoji={imageEmoji} selected={true} />);
				mockAllIsIntersecting(true);
				const imageWrapper = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(imageWrapper).toHaveClass(commonSelectedStyles);
			});

			it('should be wrapped in a tooltip if showTooltip is set to true', async () => {
				const result = renderWithIntl(<CompiledEmoji emoji={imageEmoji} showTooltip={true} />);
				const imageWrapper = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(imageWrapper).toHaveAttribute('title', ':grimacing:');
			});

			it('should not be wrapped in a tooltip if showTooltip is not set', async () => {
				const result = renderWithIntl(<CompiledEmoji emoji={imageEmoji} />);
				const imageWrapper = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(imageWrapper).not.toHaveAttribute('title');
			});

			it('should show delete button is showDelete is passed in', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} showDelete={true} />);
				const deleteBtn = result.getByTestId(RENDER_EMOJI_DELETE_BUTTON_TESTID);
				expect(deleteBtn).toBeDefined();
			});

			it('should not show delete button if showDelete is not passed in', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} />);
				expect(result.queryByTestId(RENDER_EMOJI_DELETE_BUTTON_TESTID)).toBeNull();
			});

			it('should automatically set width to auto if autoWidth is true', async () => {
				const result = await renderWithIntl(
					<CompiledEmoji emoji={imageEmoji} fitToHeight={25} autoWidth />,
				);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('width', 'auto');
			});

			it('should disable lazy load if disableLazyLoad is true', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} disableLazyLoad />);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('loading', 'eager');
			});

			it('should call onLoadSuccess handler if image is fetched succesfully', async () => {
				const onLoadSuccess = jest.fn();
				const result = await renderWithIntl(
					<CompiledEmoji emoji={imageEmoji} disableLazyLoad onLoadSuccess={onLoadSuccess} />,
				);
				const image = result.getByAltText(imageEmoji.name);
				if (image) {
					fireEvent.load(image);
				}
				expect(onLoadSuccess).toHaveBeenCalled();
			});
		});

		describe('accessibility', () => {
			it('should have img role if not interactive', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} />);
				mockAllIsIntersecting(true);
				const emoji = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(emoji).toHaveAttribute('role', 'img');
			});

			it('should have button role if interactive', async () => {
				const result = await renderWithIntl(
					<CompiledEmoji emoji={imageEmoji} shouldBeInteractive />,
				);
				mockAllIsIntersecting(true);
				const emoji = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(emoji).toHaveAttribute('role', 'button');
			});

			it('should not have any accessibility violations for sprite emoji', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				const results = await axe(component);

				expect(results).toHaveNoViolations();
			});

			it('should not have any accessibility violations for image emoji', async () => {
				const result = await renderWithIntl(<CompiledEmoji emoji={imageEmoji} />);
				const component = result.getByAltText(imageEmoji.name);
				const results = await axe(component);

				expect(results).toHaveNoViolations();
			});
		});
	});

	describe('platform_editor_css_migrate_emoji "off" - emotion', () => {
		describe('as sprite', () => {
			it('should use spritesheet if present', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component.firstChild).toHaveStyle(
					`background-image: url(https://path-to-spritesheet.png)`,
				);
			});

			it('should use percentage for background-position', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component.firstChild).toHaveStyle(`background-position: 20% 20%`);
			});

			it('should use zoom the background image', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component.firstChild).toHaveStyle(`background-size: 600% 600%`);
			});

			it('should be selected', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={spriteEmoji} selected={true} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component).toHaveClass(commonSelectedStyles);
			});

			it('should be wrapped in a tooltip if showTooltip is set to true', async () => {
				const result = await renderWithIntl(
					<EmotionEmoji emoji={spriteEmoji} showTooltip={true} />,
				);
				expect(result.getByTitle(':grimacing:')).toBeDefined();
			});

			it('should not be wrapped in a tooltip if showTooltip is not set', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				expect(component).not.toHaveAttribute('title');
			});
		});

		describe('as image', () => {
			it('should use image by default', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} />);
				mockAllIsIntersecting(true);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('src', 'https://path-to-image.png');
			});

			it('should have emoji class', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} />);
				mockAllIsIntersecting(true);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveClass('emoji');
			});

			it('should have "data-emoji-short-name" attribute', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} />);
				mockAllIsIntersecting(true);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('data-emoji-short-name', ':grimacing:');
			});

			it('should use altRepresentation image if fitToHeight is larger than representation height', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} fitToHeight={26} />);
				mockAllIsIntersecting(true);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('src', 'https://alt-path-to-image.png');
			});

			it('should be selected', async () => {
				const result = renderWithIntl(<EmotionEmoji emoji={imageEmoji} selected={true} />);
				mockAllIsIntersecting(true);
				const imageWrapper = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(imageWrapper).toHaveClass(commonSelectedStyles);
			});

			it('should be wrapped in a tooltip if showTooltip is set to true', async () => {
				const result = renderWithIntl(<EmotionEmoji emoji={imageEmoji} showTooltip={true} />);
				const imageWrapper = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(imageWrapper).toHaveAttribute('title', ':grimacing:');
			});

			it('should not be wrapped in a tooltip if showTooltip is not set', async () => {
				const result = renderWithIntl(<EmotionEmoji emoji={imageEmoji} />);
				const imageWrapper = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(imageWrapper).not.toHaveAttribute('title');
			});

			it('should show delete button is showDelete is passed in', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} showDelete={true} />);
				const deleteBtn = result.getByTestId(RENDER_EMOJI_DELETE_BUTTON_TESTID);
				expect(deleteBtn).toBeDefined();
			});

			it('should not show delete button if showDelete is not passed in', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} />);
				expect(result.queryByTestId(RENDER_EMOJI_DELETE_BUTTON_TESTID)).toBeNull();
			});

			it('should automatically set width to auto if autoWidth is true', async () => {
				const result = await renderWithIntl(
					<EmotionEmoji emoji={imageEmoji} fitToHeight={25} autoWidth />,
				);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('width', 'auto');
			});

			it('should disable lazy load if disableLazyLoad is true', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} disableLazyLoad />);
				const image = result.getByAltText(imageEmoji.name);
				expect(image).toHaveAttribute('loading', 'eager');
			});

			it('should call onLoadSuccess handler if image is fetched succesfully', async () => {
				const onLoadSuccess = jest.fn();
				const result = await renderWithIntl(
					<EmotionEmoji emoji={imageEmoji} disableLazyLoad onLoadSuccess={onLoadSuccess} />,
				);
				const image = result.getByAltText(imageEmoji.name);
				if (image) {
					fireEvent.load(image);
				}
				expect(onLoadSuccess).toHaveBeenCalled();
			});
		});

		describe('accessibility', () => {
			it('should have img role if not interactive', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} />);
				mockAllIsIntersecting(true);
				const emoji = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(emoji).toHaveAttribute('role', 'img');
			});

			it('should have button role if interactive', async () => {
				const result = await renderWithIntl(
					<EmotionEmoji emoji={imageEmoji} shouldBeInteractive />,
				);
				mockAllIsIntersecting(true);
				const emoji = result.getByTestId(`image-emoji-${imageEmoji.shortName}`);
				expect(emoji).toHaveAttribute('role', 'button');
			});

			it('should not have any accessibility violations for sprite emoji', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={spriteEmoji} />);
				const component = result.getByTestId(`sprite-emoji-${spriteEmoji.shortName}`);
				const results = await axe(component);

				expect(results).toHaveNoViolations();
			});

			it('should not have any accessibility violations for image emoji', async () => {
				const result = await renderWithIntl(<EmotionEmoji emoji={imageEmoji} />);
				const component = result.getByAltText(imageEmoji.name);
				const results = await axe(component);

				expect(results).toHaveNoViolations();
			});
		});
	});
});
