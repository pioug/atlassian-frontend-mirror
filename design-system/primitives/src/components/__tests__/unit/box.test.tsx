import React from 'react';

import { render, screen } from '@testing-library/react';

import { Box, xcss } from '../../../index';

const styles = xcss({
	backgroundColor: 'color.background.brand.bold',
	padding: 'space.100',
	paddingBlock: 'space.100',
	paddingBlockStart: 'space.100',
	paddingBlockEnd: 'space.100',
	paddingInline: 'space.100',
	paddingInlineStart: 'space.100',
	paddingInlineEnd: 'space.100',
});

describe('Box component', () => {
	const testId = 'test';

	it('should render box', () => {
		render(<Box>Box</Box>);
		expect(screen.getByText('Box')).toBeInTheDocument();
	});

	it('should render with a given test id', () => {
		render(<Box testId={testId}>Box with testid</Box>);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
	});

	it('should render div by default', () => {
		render(<Box testId={testId}>Box as div default</Box>);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.tagName).toBe('DIV');
	});

	it('should render given `as` element', () => {
		render(
			<Box testId={testId} as="span">
				Box as span
			</Box>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.tagName).toBe('SPAN');
	});

	it('should render with plaintext', () => {
		render(<Box testId={testId}>Box plaintext</Box>);
		const element = screen.getByText('Box plaintext');
		expect(element).toBeInTheDocument();
	});

	it('should render children', () => {
		render(
			<Box testId={testId}>
				<Box testId="box-child">Child box</Box>
			</Box>,
		);
		const parent = screen.getByTestId(testId);
		expect(parent).toBeInTheDocument();
		const child = screen.getByTestId('box-child');
		expect(child).toBeInTheDocument();
	});

	it('should apply HTML/aria attributes', () => {
		render(
			<Box testId={testId} role="region" aria-label="test box">
				Box with HTML attributes
			</Box>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element).toHaveAttribute('role', 'region');
		expect(element).toHaveAttribute('aria-label', 'test box');
	});

	test('`xcss` should result in expected css', () => {
		render(
			<Box
				testId={testId}
				backgroundColor="elevation.surface"
				padding="space.0"
				paddingBlock="space.0"
				paddingBlockStart="space.0"
				paddingBlockEnd="space.0"
				paddingInline="space.0"
				paddingInlineStart="space.0"
				paddingInlineEnd="space.0"
				xcss={styles}
			>
				child
			</Box>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();

		expect(element).toHaveCompiledCss({
			// Every value in here overrides the props values
			// eg. `props.padding="space.0"` is overridden by `xcss.padding: 'space.100'`
			backgroundColor: 'var(--ds-surface, #FFFFFF)',
			padding: 'var(--ds-space-100, 8px)',
			paddingBlock: 'var(--ds-space-100, 8px)',
			paddingBlockStart: 'var(--ds-space-100, 8px)',
			paddingBlockEnd: 'var(--ds-space-100, 8px)',
			paddingInline: 'var(--ds-space-100, 8px)',
			paddingInlineStart: 'var(--ds-space-100, 8px)',
			paddingInlineEnd: 'var(--ds-space-100, 8px)',
		});
	});
});
