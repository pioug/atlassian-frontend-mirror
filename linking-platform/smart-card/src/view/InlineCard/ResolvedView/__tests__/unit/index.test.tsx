import React from 'react';
import { render, screen } from '@testing-library/react';
import { InlineCardResolvedView } from '../../index';
import { type LozengeProps } from '../../../../../types';
import { token } from '@atlaskit/tokens';
import { Provider } from '../../../../../';

jest.mock('react-render-image');

describe('ResolvedView', () => {
	it('should render the title', async () => {
		render(<InlineCardResolvedView title="some text content" />);
		expect(await screen.findByText('some text content')).toBeVisible();
	});

	it('should render an icon when one is provided', async () => {
		render(<InlineCardResolvedView icon="some-link-to-icon" title="some text content" />);
		expect(await screen.findByRole('img')).toHaveAttribute('src', 'some-link-to-icon');
	});

	it('should not render icon when one is not provided', async () => {
		render(<InlineCardResolvedView title="some text content" />);
		expect(await screen.findByRole('img')).not.toHaveAttribute('src');
	});

	it('should render text color when provided', async () => {
		render(
			<InlineCardResolvedView
				icon="some-link-to-icon"
				title="some text content"
				titleTextColor={token('color.text.inverse', '#FFFFFF')}
			/>,
		);
		expect(await screen.findByText('some text content')).toHaveStyle(
			`color: var(--ds-text-inverse, '#FFFFFF')`,
		);
	});

	it('should render a lozenge when one is provided', async () => {
		const lozengeProps: LozengeProps = {
			text: 'some-lozenge-text',
			isBold: true,
			appearance: 'inprogress',
		};
		render(<InlineCardResolvedView title="some text content" lozenge={lozengeProps} />);
		const lozenge = await screen.findByText('some-lozenge-text');
		expect(lozenge).toHaveStyle(
			`background-color: ${token('color.background.information.bold', '#0052CC')}`,
		);
		expect(lozenge).toHaveStyle(`color: ${token('color.text.inverse', '#FFFFFF')}`);
	});

	it('should not render a lozenge when one is not provided', () => {
		render(<InlineCardResolvedView title="some text content" />);
		expect(screen.queryByTestId('inline-card-resolved-view-lozenge')).not.toBeInTheDocument();
	});

	it('should render a hover preview when its prop is enabled and link is included', async () => {
		render(
			<Provider>
				<InlineCardResolvedView showHoverPreview={true} link="www.test.com" />,
			</Provider>,
		);
		expect(await screen.findByTestId('hover-card-trigger-wrapper')).toBeInTheDocument();
	});

	it('should not render a hover preview when its prop is disabled and link is not included', () => {
		render(<InlineCardResolvedView showHoverPreview={false} />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});

	it('should not render a hover preview when prop is enabled and link is not included', () => {
		render(<InlineCardResolvedView showHoverPreview={true} />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});

	it('should not render a hover preview when prop is disabled and link is included', () => {
		render(<InlineCardResolvedView showHoverPreview={false} link="www.test.com" />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});

	it('should not render a hover preview when prop is not provided', () => {
		render(<InlineCardResolvedView link="www.test.com" />);
		expect(screen.queryByTestId('hover-card-trigger-wrapper')).not.toBeInTheDocument();
	});
});
