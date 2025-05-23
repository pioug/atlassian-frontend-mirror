/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { cssMap, cx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

import { Box } from '../../../index';

const styles = cssMap({
	root: {
		// TODO (AFB-874): Disabling due to overriding of @compiled/property-shorthand-sorting
		// eslint-disable-next-line @atlaskit/platform/expand-spacing-shorthand
		padding: token('space.100'),
		paddingBlock: token('space.100'),
		paddingBlockStart: token('space.100'),
		paddingBlockEnd: token('space.100'),
		paddingInline: token('space.100'),
		paddingInlineStart: token('space.100'),
		paddingInlineEnd: token('space.100'),
	},
	disallowed: {
		backgroundColor: token('color.background.brand.bold'),
	},
});

describe('Box component', () => {
	const testId = 'test';

	it('should render Box', () => {
		render(<Box backgroundColor="elevation.surface">Box</Box>);
		expect(screen.getByText('Box')).toBeInTheDocument();
	});

	it('should render with a given test id', () => {
		render(
			<Box backgroundColor="elevation.surface" testId={testId}>
				Box with testid
			</Box>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
	});

	it('should render div by default', () => {
		render(
			<Box backgroundColor="elevation.surface" testId={testId}>
				Box as div default
			</Box>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.tagName).toBe('DIV');
	});

	it('should render given `as` element', () => {
		render(
			<Box backgroundColor="elevation.surface" testId={testId} as="span">
				Box as span
			</Box>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element.tagName).toBe('SPAN');
	});

	it('should render with plaintext', () => {
		render(
			<Box backgroundColor="elevation.surface" testId={testId}>
				Box plaintext
			</Box>,
		);
		const element = screen.getByText('Box plaintext');
		expect(element).toBeInTheDocument();
	});

	it('should render children', () => {
		render(
			<Box backgroundColor="elevation.surface" testId={testId}>
				<Box backgroundColor="elevation.surface.sunken" testId="Box-child">
					Child Box
				</Box>
			</Box>,
		);

		const parent = screen.getByTestId(testId);
		expect(parent).toBeInTheDocument();
		const child = screen.getByTestId('Box-child');
		expect(child).toBeInTheDocument();
	});

	it('should apply HTML/aria attributes', () => {
		render(
			<Box backgroundColor="elevation.surface" testId={testId} role="region" aria-label="test Box">
				Box with HTML attributes
			</Box>,
		);
		const element = screen.getByTestId(testId);
		expect(element).toBeInTheDocument();
		expect(element).toHaveAttribute('role', 'region');
		expect(element).toHaveAttribute('aria-label', 'test Box');
	});

	test("allows `backgroundColor` in `xcss` and `style` even though it's deprecated", () => {
		render(
			<Box
				backgroundColor="elevation.surface"
				testId={testId}
				xcss={cx(styles.root, styles.disallowed)}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Testing this scenario, would expect `props.background` or similar, not hardcoded styles
				style={{ backgroundColor: 'red' }}
			>
				child
			</Box>,
		);

		expect(screen.getByTestId(testId)).toHaveCompiledCss({
			// NOTE: This does still override, the `styles.root` backgroundColor is used
			// However, note the `props.style` will actually win, it's just not accounted for in `toHaveCompiledCss`
			backgroundColor: 'var(--ds-background-brand-bold,#0c66e4)',
		});
	});

	test('`xcss` should result in expected css', () => {
		render(
			<Box backgroundColor="elevation.surface" testId={testId} xcss={styles.root}>
				child
			</Box>,
		);

		expect(screen.getByTestId(testId)).toHaveCompiledCss({
			// There are no overrides as `xcss.backgroundColor` is not allowed!
			backgroundColor: 'var(--ds-surface,#fff)',
			// NOTE: Technically, this may be parsed differently because shorthand properties are converted in production
			padding: 'var(--ds-space-100,8px)',
			paddingBlock: 'var(--ds-space-100,8px)',
			paddingBlockStart: 'var(--ds-space-100,8px)',
			paddingBlockEnd: 'var(--ds-space-100,8px)',
			paddingInline: 'var(--ds-space-100,8px)',
			paddingInlineStart: 'var(--ds-space-100,8px)',
			paddingInlineEnd: 'var(--ds-space-100,8px)',
		});
	});
});
