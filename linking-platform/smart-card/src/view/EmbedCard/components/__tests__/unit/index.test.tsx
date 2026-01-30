import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Box } from '@atlaskit/primitives/compiled';

import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';
import { ExpandedFrame } from '../../../components/ExpandedFrame';

describe('ExpandedFrame', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ExpandedFrame icon={<span data-testid="icon" />} isPlaceholder={true} />,
		);

		await expect(container).toBeAccessible();
	});

	it('should render an icon when provided', async () => {
		render(<ExpandedFrame icon={<span data-testid="icon" />} />);
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
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
		});
	});

	it('should not allow scrolling when allowScrolling is false', async () => {
		render(<ExpandedFrame allowScrollBar={false} setOverflow={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
		});
	});

	it('should allow scrolling when allowScrolling is true', async () => {
		render(<ExpandedFrame allowScrollBar={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'auto',
			'overflow-y': 'auto',
		});
	});

	it('should allow scrolling when allowScrolling is true and setOverflow is true', async () => {
		render(<ExpandedFrame allowScrollBar={true} setOverflow={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'auto',
			'overflow-y': 'auto',
		});
	});

	it('should not set overflow property when setOverflow is false', async () => {
		render(<ExpandedFrame allowScrollBar={false} setOverflow={false} />);
		expect(await screen.findByTestId('embed-content-wrapper')).not.toHaveCompiledCss({
			'overflow-x': expect.any(String),
			'overflow-y': expect.any(String),
		});
	});

	it('should not allow scrolling (or clip content) when setOverflow is false even if allowScrollBar is true', async () => {
		render(<ExpandedFrame allowScrollBar={true} setOverflow={false} />);
		expect(await screen.findByTestId('embed-content-wrapper')).not.toHaveCompiledCss({
			'overflow-x': expect.any(String),
			'overflow-y': expect.any(String),
		});
	});

	it('should clip content and not allow scrolling when setOverflow is true and allowScrollBar is false', async () => {
		render(<ExpandedFrame allowScrollBar={false} setOverflow={true} />);
		expect(await screen.findByTestId('embed-content-wrapper')).toHaveCompiledCss({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
		});
	});

	it('should not render header and frame when frameStyle = "hide" & href is provided', async () => {
		const { container } = render(<ExpandedFrame frameStyle="hide" href="some.url" />);
		expect(await screen.findByTestId('expanded-frame')).toBeDefined();
		const embedHeaderElements = container.getElementsByClassName('embed-header');
		expect(embedHeaderElements).toHaveLength(0);
	});

	it('should not render header and frame when frameStyle = "hide" & placeholder is true', async () => {
		const { container } = render(<ExpandedFrame frameStyle="hide" isPlaceholder={true} />);
		expect(await screen.findByTestId('expanded-frame')).toBeDefined();
		const embedHeaderElements = container.getElementsByClassName('embed-header');
		expect(embedHeaderElements).toHaveLength(0);
	});

	it('No tooltip is rendered by default', () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});

	it('Tooltip is rendered when hovered', async () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
		const header = await screen.findByText('foobar');

		await userEvent.hover(header);

		const tooltip = await waitFor(
			() =>
				screen.findByRole('tooltip', {
					name: 'foobar',
				}),
			{ timeout: 2000 },
		);

		expect(tooltip).toBeVisible();
	});

	it('Tooltip is not rendered when not hovered', async () => {
		render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
		const header = await screen.findByText('foobar');

		await userEvent.hover(header);
		await userEvent.unhover(header);

		expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
	});
});

describe('ExpandedFrame with CompetitorPrompt', () => {
	const CompetitorPrompt = () => <Box testId="competitor-prompt">Prompt</Box>;

	it('should render CompetitorPrompt when provided and conditions are met', async () => {
		render(
			<ExpandedFrame
				text="foobar"
				href="https://example.com"
				CompetitorPrompt={CompetitorPrompt}
				isPlaceholder={false}
			/>,
		);

		const competitorPrompt = await screen.findByTestId('competitor-prompt');
		expect(competitorPrompt).toBeInTheDocument();
		expect(competitorPrompt).toHaveTextContent('Prompt');
	});
});
