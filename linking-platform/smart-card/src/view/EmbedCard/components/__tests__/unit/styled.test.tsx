import React from 'react';

import { render, screen } from '@testing-library/react';

import {
	ContentOldVisualRefresh,
	IconWrapperOldVisualRefresh,
	LinkWrapperOldVisualRefresh,
	TextWrapperOldVisualRefresh,
	WrapperOldVisualRefresh,
} from '../../styled';

describe('Wrapper', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(<WrapperOldVisualRefresh minWidth={100} data-testid="wrapper" />);

		await expect(container).toBeAccessible();
	});

	it('should render with min-width when there is a minWidth', async () => {
		render(<WrapperOldVisualRefresh minWidth={100} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveCompiledCss({ 'min-width': '100px' });
	});

	it('should not render with min-width when there is no minWidth', async () => {
		render(<WrapperOldVisualRefresh data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveCompiledCss('min-width', '');
	});

	it('should render with max-width when there is a maxWidth', async () => {
		render(<WrapperOldVisualRefresh maxWidth={100} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveCompiledCss({ 'max-width': '100px' });
	});

	it('should not render with max-width when there is no maxWidth', async () => {
		render(<WrapperOldVisualRefresh data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveCompiledCss('max-width', '');
	});
});

describe('LinkWrapper', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<LinkWrapperOldVisualRefresh minWidth={100} data-testid="wrapper" />,
		);

		await expect(container).toBeAccessible();
	});

	it('should render with minWidth when there is a minWidth', async () => {
		render(<LinkWrapperOldVisualRefresh minWidth={100} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveCompiledCss({ 'min-width': '100px' });
	});

	it('should not render with minWidth when there is no minWidth', async () => {
		render(<LinkWrapperOldVisualRefresh data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveCompiledCss('min-width', '');
	});

	it('should render with minWidth when there is a minWidth', async () => {
		render(<LinkWrapperOldVisualRefresh maxWidth={100} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveCompiledCss({ 'max-width': '100px' });
	});

	it('should not render with minWidth when there is no minWidth', async () => {
		render(<LinkWrapperOldVisualRefresh data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveCompiledCss('max-width', '');
	});
});

describe('Content', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<ContentOldVisualRefresh isInteractive={true} allowScrollBar={false} data-testid="content" />,
		);

		await expect(container).toBeAccessible();
	});

	it('should not allow overflow content to be visible (on hover as well)', async () => {
		render(
			<ContentOldVisualRefresh isInteractive={true} allowScrollBar={false} data-testid="content" />,
		);
		expect(await screen.findByTestId('content')).toHaveCompiledCss({
			'overflow-x': 'hidden',
			'overflow-y': 'hidden',
		});
	});

	describe('should allow overflow content to be visible when allowScrollBar is true', () => {
		it('and isInteractive is true', async () => {
			render(
				<ContentOldVisualRefresh
					isInteractive={true}
					allowScrollBar={true}
					data-testid="content"
				/>,
			);
			expect(await screen.findByTestId('content')).toHaveCompiledCss({
				'overflow-x': 'auto',
				'overflow-y': 'auto',
			});
		});
		it('and isInteractive is false', async () => {
			render(
				<ContentOldVisualRefresh
					isInteractive={false}
					allowScrollBar={true}
					data-testid="content"
				/>,
			);
			expect(await screen.findByTestId('content')).toHaveCompiledCss({
				'overflow-x': 'auto',
				'overflow-y': 'auto',
			});
		});
	});

	describe('should not set set overflow styles when removeOverflow is true', () => {
		it('and allowScrollBar is true and isInteractive is true', async () => {
			render(
				<ContentOldVisualRefresh
					isInteractive={true}
					allowScrollBar={true}
					removeOverflow={true}
					data-testid="content"
				/>,
			);
			expect(await screen.findByTestId('content')).toHaveStyle('overflow:');
		});
		it('and allowScrollBar is false and isInteractive is true', async () => {
			render(
				<ContentOldVisualRefresh
					isInteractive={true}
					allowScrollBar={false}
					removeOverflow={true}
					data-testid="content"
				/>,
			);
			expect(await screen.findByTestId('content')).toHaveStyle('overflow:');
		});
		it('and allowScrollBar is true and isInteractive is false', async () => {
			render(
				<ContentOldVisualRefresh
					isInteractive={false}
					allowScrollBar={true}
					removeOverflow={true}
					data-testid="content"
				/>,
			);
			expect(await screen.findByTestId('content')).toHaveStyle('overflow:');
		});
		it('and allowScrollBar is false and isInteractive is false', async () => {
			render(
				<ContentOldVisualRefresh
					isInteractive={false}
					allowScrollBar={false}
					removeOverflow={true}
					data-testid="content"
				/>,
			);
			expect(await screen.findByTestId('content')).toHaveStyle('overflow:');
		});
	});
});

describe('IconWrapper', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<IconWrapperOldVisualRefresh isPlaceholder={true} data-testid="wrapper" />,
		);

		await expect(container).toBeAccessible();
	});

	it('should look like a placeholder when isPlaceholder=true', async () => {
		render(<IconWrapperOldVisualRefresh isPlaceholder={true} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveStyle({
			'background-color': 'rgba(0, 0, 0, 0)',
		});
	});

	it('should look like a placeholder when isPlaceholder=false', async () => {
		render(<IconWrapperOldVisualRefresh isPlaceholder={false} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveCompiledCss(
			'background-color',
			'var(--ds-skeleton, #EBECF0)',
		);
	});
});

describe('TextWrapper', () => {
	it('should capture and report a11y violations', async () => {
		const { container } = render(
			<TextWrapperOldVisualRefresh isPlaceholder={true} data-testid="wrapper" />,
		);

		await expect(container).toBeAccessible();
	});

	it('should look like a placeholder when isPlaceholder=true', async () => {
		render(<TextWrapperOldVisualRefresh isPlaceholder={true} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveStyle({
			'background-color': 'rgba(0, 0, 0, 0)',
		});
	});

	it('should look like a placeholder when isPlaceholder=false', async () => {
		render(<TextWrapperOldVisualRefresh isPlaceholder={false} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveCompiledCss(
			'background-color',
			'var(--ds-skeleton, #EBECF0)',
		);
	});
});
