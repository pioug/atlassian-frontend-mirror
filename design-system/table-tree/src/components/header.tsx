/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import CommonCell from './internal/common-cell';
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
	/**
	 * The contents of the header.
	 */
	children?: React.ReactNode;
	onClick?: () => void;
	id?: string;
	role?: string;
};

const HeaderComponent = ({ width, children, onClick, id, role = 'columnheader' }: HeaderProps) => {
	// TODO: Determine whether proper `th` elements can be used instead of
	// roles (DSP-11588)
	return (
		<CommonCell css={headerStyles} role={role} width={width} id={id} onClick={onClick}>
			{children}
		</CommonCell>
	);
};

const Header = withColumnWidth(HeaderComponent);

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Header;
