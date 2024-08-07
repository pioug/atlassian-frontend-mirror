/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Component } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import ColumnCell from './internal/common-cell';
import withColumnWidth from './internal/with-column-width';

const headerStyles = css({
	color: token('color.text.subtle', N300),
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.bold'),
});

/**
 * This is hard-coded here because our actual <Header /> has no typings
 * for its props.
 *
 * Adding types for real *might* break things so will need a little care.
 *
 * Defining it here for now lets us provide *something* without much headache.
 */
export type HeaderProps = {
	/**
	 * Width of the header item. Takes a string, or a number representing the width in pixels.
	 */
	width?: string | number;
};

class HeaderComponent extends Component<any> {
	render() {
		const { props } = this;
		return (
			// TODO: Determine whether proper `th` elements can be used instead of
			// roles (DSP-11588)
			<ColumnCell css={headerStyles} role="columnheader" style={{ width: props.width }} {...props}>
				{props.children}
			</ColumnCell>
		);
	}
}

const Header = withColumnWidth(HeaderComponent);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Header;
