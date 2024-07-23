/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import { render, screen } from '@testing-library/react';

import { css } from '@atlaskit/css';

const stylesStyles = css({ color: 'var(--ds-link)' });

describe('strict compiled tests', () => {
	it('should assert colors exist', () => {
		render(<div css={stylesStyles}>Foo</div>);

		expect(screen.getByText('Foo')).toHaveCompiledCss('color', 'var(--ds-link)');
	});
});
