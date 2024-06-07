import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import { renderWithIntl } from '../../_testing-library';

// Add matcher provided by 'jest-axe'
expect.extend(toHaveNoViolations);

describe('<EmojiPlaceholder />', () => {
	describe('render', () => {
		it('should render with fitToHeight', async () => {
			const shortName = ':rage:';
			const wrapper = await renderWithIntl(
				<EmojiPlaceholder shortName={shortName} showTooltip={false} size={48} />,
			);

			const span = await wrapper.findByLabelText(shortName);
			expect(span).toHaveStyle('min-width: 48px');
			expect(span).toHaveStyle('height: 48px');
		});

		it('should render with default height', async () => {
			const shortName = ':rage:';
			const wrapper = await renderWithIntl(
				<EmojiPlaceholder shortName={shortName} showTooltip={false} />,
			);

			const span = await wrapper.findByLabelText(shortName);
			expect(span).toHaveStyle('min-width: 20px');
			expect(span).toHaveStyle('height: 20px');
		});

		it('should render with provided size', async () => {
			const shortName = ':rage:';
			const wrapper = await renderWithIntl(
				<EmojiPlaceholder shortName={shortName} showTooltip={false} size={64} />,
			);

			const span = await wrapper.findByLabelText(shortName);
			expect(span).toHaveStyle('min-width: 64px');
			expect(span).toHaveStyle('height: 64px');
		});

		it('should render image representation with custom size', async () => {
			const shortName = ':rage:';
			const rep = {
				imagePath: '/path/bla.png',
				width: 256,
				height: 128,
			};
			const wrapper = await renderWithIntl(
				<EmojiPlaceholder
					shortName={shortName}
					showTooltip={false}
					representation={rep}
					size={48}
				/>,
			);

			const span = await wrapper.findByLabelText(shortName);
			expect(span).toHaveStyle('min-width: 96px');
			expect(span).toHaveStyle('height: 48px');
		});

		it('should render media representation with custom size', async () => {
			const shortName = ':rage:';
			const rep = {
				mediaPath: '/path/bla.png',
				width: 256,
				height: 128,
			};
			const wrapper = await renderWithIntl(
				<EmojiPlaceholder
					shortName={shortName}
					showTooltip={false}
					representation={rep}
					size={48}
				/>,
			);
			const span = await wrapper.findByLabelText(shortName);
			expect(span).toHaveStyle('min-width: 96px');
			expect(span).toHaveStyle('height: 48px');
		});
	});

	describe('accessibility', () => {
		it.skip('should not have any accessibility violations', async () => {
			const shortName = ':rage:';
			const { container } = await renderWithIntl(
				<EmojiPlaceholder shortName={shortName} showTooltip={false} size={48} />,
			);
			const results = await axe(container);

			expect(results).toHaveNoViolations();
		});
	});

	describe('is loading', () => {
		it('when loading prop is toggled', async () => {
			const shortName = ':rage:';
			const wrapper = await renderWithIntl(
				<EmojiPlaceholder shortName={shortName} showTooltip={false} loading />,
			);

			let span;

			span = await wrapper.findByLabelText(shortName);
			expect(span).toHaveAttribute('aria-busy', 'true');

			wrapper.rerender(
				<EmojiPlaceholder shortName={shortName} showTooltip={false} loading={false} />,
			);

			span = await wrapper.findByLabelText(shortName);
			expect(span).toHaveAttribute('aria-busy', 'false');

			wrapper.rerender(<EmojiPlaceholder shortName={shortName} showTooltip={false} />);

			span = await wrapper.findByLabelText(shortName);
			expect(span).toHaveAttribute('aria-busy', 'false');
		});
	});
});
