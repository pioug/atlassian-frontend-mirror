import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { ExpandedFrame } from '../../../components/ExpandedFrame';
import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';
import userEvent from '@testing-library/user-event';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('ExpandedFrame', () => {
	it('should not render an icon when isPlaceholder=true', async () => {
		render(<ExpandedFrame icon={<span data-testid="icon" />} isPlaceholder={true} />);
		expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
	});

	it('should render an icon when isPlaceholder=false', async () => {
		render(<ExpandedFrame icon={<span data-testid="icon" />} isPlaceholder={false} />);
		expect(await screen.findByTestId('icon')).toBeInTheDocument();
	});

	it('should not render text when isPlaceholder=true', async () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={true} />);
		await expectElementWithText('expanded-frame', '');
	});

	it('should render text when isPlaceholder=false', async () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
		await expectElementWithText('expanded-frame', 'foobar');
	});

	it('should not allow scrolling when allowScrolling is undefined', async () => {
		render(<ExpandedFrame />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveStyle('overflow: hidden');
	});

	it('should not allow scrolling when allowScrolling is false', async () => {
		render(<ExpandedFrame allowScrollBar={false} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveStyle('overflow: hidden');
	});

	it('should allow scrolling when allowScrolling is true', async () => {
		render(<ExpandedFrame allowScrollBar={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveStyle('overflow: auto');
	});

	it('should not render header and frame when frameStyle = "hide" & href is provided', async () => {
		const { container } = render(<ExpandedFrame frameStyle="hide" href="some.url" />);
		expect(await screen.findByTestId('expanded-frame')).toBeDefined();
		const embedHeaderElements = container.getElementsByClassName('embed-header');
		expect(embedHeaderElements).toHaveLength(1);

		const frameStyle = window.getComputedStyle(embedHeaderElements[0]);
		expect(frameStyle.opacity).toBe('0');
	});

	it('should not render header and frame when frameStyle = "hide" & placeholder is true', async () => {
		const { container } = render(<ExpandedFrame frameStyle="hide" isPlaceholder={true} />);
		expect(await screen.findByTestId('expanded-frame')).toBeDefined();
		const embedHeaderElements = container.getElementsByClassName('embed-header');
		expect(embedHeaderElements).toHaveLength(1);

		const frameStyle = window.getComputedStyle(embedHeaderElements[0]);
		expect(frameStyle.opacity).toBe('0');
	});

	describe('No tooltip is rendered by default', () => {
		ffTest(
			'platform.linking-platform.smart-card.enable-embed-card-header-tooltip_g9saw',
			// Test passes whether FF is on or off
			() => {
				render(<ExpandedFrame text="foobar" isPlaceholder={false} />);

				expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
			},
		);
	});

	describe('Tooltip is rendered when hovered', () => {
		ffTest(
			'platform.linking-platform.smart-card.enable-embed-card-header-tooltip_g9saw',
			// FF is on
			async () => {
				render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
				const header = await screen.getByText('foobar');

				await userEvent.hover(header);

				const tooltip = await waitFor(
					() =>
						screen.findByRole('tooltip', {
							name: 'foobar',
						}),
					{ timeout: 2000 },
				);

				expect(tooltip).toBeVisible();
			},
			// FF is off
			async () => {
				render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
				const header = await screen.getByText('foobar');

				await userEvent.hover(header);

				expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
			},
		);
	});

	describe('Tooltip is not rendered when not hovered', () => {
		ffTest(
			'platform.linking-platform.smart-card.enable-embed-card-header-tooltip_g9saw',
			// Test passes whether FF is on or off
			async () => {
				render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
				const header = await screen.getByText('foobar');

				await userEvent.hover(header);
				await userEvent.unhover(header);

				expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
			},
		);
	});
});
