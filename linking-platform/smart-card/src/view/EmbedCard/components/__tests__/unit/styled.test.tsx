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

// TODO: fix these tests so that compiled can recognise overflow prop
describe.skip('Content', () => {
	it('should not allow overflow content to be visible (iframe contents should handle scrolling)', async () => {
		render(
			<ContentOldVisualRefresh
				isInteractive={false}
				allowScrollBar={false}
				data-testid="content"
				removeOverflow={true}
			/>,
		);
		expect(await screen.findByTestId('content')).toHaveCompiledCss('overflow', 'hidden');
	});

	it('should not allow overflow content to be visible (on hover as well)', async () => {
		render(
			<ContentOldVisualRefresh isInteractive={true} allowScrollBar={false} data-testid="content" />,
		);
		expect(await screen.findByTestId('content')).toHaveCompiledCss({ overflow: 'hidden' });
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
			expect(await screen.findByTestId('content')).toHaveCompiledCss({ overflow: 'auto' });
		});
		it('and isInteractive is false', async () => {
			render(
				<ContentOldVisualRefresh
					isInteractive={false}
					allowScrollBar={true}
					data-testid="content"
				/>,
			);
			expect(await screen.findByTestId('content')).toHaveCompiledCss('overflow', 'auto');
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
