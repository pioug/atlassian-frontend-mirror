import React from 'react';
import { render, screen } from '@testing-library/react';
import { matchers } from 'jest-emotion';
import { Wrapper, LinkWrapper, IconWrapper, TextWrapper, Content } from '../../styled';

expect.extend(matchers);

describe('Wrapper', () => {
	it('should render with min-width when there is a minWidth', async () => {
		render(<Wrapper minWidth={100} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveStyleRule('min-width', '100px');
	});

	it('should not render with min-width when there is no minWidth', async () => {
		render(<Wrapper data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveStyleRule('min-width', '');
	});

	it('should render with max-width when there is a maxWidth', async () => {
		render(<Wrapper maxWidth={100} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveStyleRule('max-width', '100px');
	});

	it('should not render with max-width when there is no maxWidth', async () => {
		render(<Wrapper data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveStyleRule('max-width', '');
	});
});

describe('LinkWrapper', () => {
	it('should render with minWidth when there is a minWidth', async () => {
		render(<LinkWrapper minWidth={100} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveStyleRule('min-width', '100px');
	});

	it('should not render with minWidth when there is no minWidth', async () => {
		render(<LinkWrapper data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveStyleRule('min-width', '');
	});

	it('should render with minWidth when there is a minWidth', async () => {
		render(<LinkWrapper maxWidth={100} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveStyleRule('max-width', '100px');
	});

	it('should not render with minWidth when there is no minWidth', async () => {
		render(<LinkWrapper data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveStyleRule('max-width', '');
	});
});

describe('Content', () => {
	it('should not allow overflow content to be visible (iframe contents should handle scrolling)', async () => {
		render(<Content isInteractive={false} allowScrollBar={false} data-testid="content" />);
		expect(await screen.findByTestId('content')).toHaveStyleRule('overflow', 'hidden');
	});

	it('should not allow overflow content to be visible (on hover as well)', async () => {
		render(<Content isInteractive={true} allowScrollBar={false} data-testid="content" />);
		expect(await screen.findByTestId('content')).toHaveStyleRule('overflow', 'hidden');
	});

	describe('should allow overflow content to be visible when allowScrollBar is true', () => {
		it('and isInteractive is true', async () => {
			render(<Content isInteractive={true} allowScrollBar={true} data-testid="content" />);
			expect(await screen.findByTestId('content')).toHaveStyleRule('overflow', 'auto');
		});
		it('and isInteractive is false', async () => {
			render(<Content isInteractive={false} allowScrollBar={true} data-testid="content" />);
			expect(await screen.findByTestId('content')).toHaveStyleRule('overflow', 'auto');
		});
	});
});

describe('IconWrapper', () => {
	it('should look like a placeholder when isPlaceholder=true', async () => {
		render(<IconWrapper isPlaceholder={true} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveStyleRule(
			'background-color',
			'var(--ds-skeleton, #EBECF0)',
		);
	});

	it('should look like a placeholder when isPlaceholder=false', async () => {
		render(<IconWrapper isPlaceholder={false} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveStyleRule(
			'background-color',
			'var(--ds-skeleton, #EBECF0)',
		);
	});
});

describe('TextWrapper', () => {
	it('should look like a placeholder when isPlaceholder=true', async () => {
		render(<TextWrapper isPlaceholder={true} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).toHaveStyleRule(
			'background-color',
			'var(--ds-skeleton, #EBECF0)',
		);
	});

	it('should look like a placeholder when isPlaceholder=false', async () => {
		render(<TextWrapper isPlaceholder={false} data-testid="wrapper" />);
		expect(await screen.findByTestId('wrapper')).not.toHaveStyleRule(
			'background-color',
			'var(--ds-skeleton, #EBECF0)',
		);
	});
});
