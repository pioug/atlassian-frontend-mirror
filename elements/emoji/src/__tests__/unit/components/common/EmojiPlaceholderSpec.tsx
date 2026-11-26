import React from 'react';

import { axe, toHaveNoViolations } from 'jest-axe';

import EmojiPlaceholder from '../../../../components/common/EmojiPlaceholder';
import { renderWithIntl } from '../../_testing-library';

// Add matcher provided by 'jest-axe'
expect.extend(toHaveNoViolations);

describe('<EmojiPlaceholder />', () => {
	it('renders with the dense emoji minimum size', async () => {
		const shortName = ':rage:';
		const wrapper = await renderWithIntl(
			<EmojiPlaceholder shortName={shortName} showTooltip={false} />,
		);

		const span = await wrapper.findByLabelText(shortName);
		expect(span).toHaveStyle({ minWidth: '16.25px', minHeight: '16.25px' });
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
