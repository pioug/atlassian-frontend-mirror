/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { css, cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const stylesStyles = css({ color: 'var(--ds-link)' });
const gapStyles = cssMap({
	root: {
		display: 'grid',
		gap: token('space.gap.medium'),
		rowGap: token('space.gap.small'),
		columnGap: token('space.gap.large'),
	},
});

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('strict compiled tests', () => {
	it('supports semantic gap tokens in gap properties', () => {
		render(<div css={gapStyles.root}>Gap tokens</div>);
		expect(screen.getByText('Gap tokens')).toHaveCompiledCss({
			rowGap: 'var(--ds-space-gap-small,6px)',
			columnGap: 'var(--ds-space-gap-large,9pt)',
		});
	});

	it('should assert colors exist', () => {
		render(<div css={stylesStyles}>Foo</div>);

		expect(screen.getByText('Foo')).toHaveCompiledCss('color', 'var(--ds-link)');
	});
});
