/** @jsx jsx */
import { Component } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { N300 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import ColumnCell from './internal/common-cell';
import withColumnWidth from './internal/with-column-width';

const headerStyles = css({
	color: token('color.text.subtle', N300),
	fontSize: token('font.size.075', '12px'),
	fontWeight: token('font.weight.bold', 'bold'),
	letterSpacing: -0.1,
	lineHeight: token('font.lineHeight.200', '20px'),
});

class Header extends Component<any> {
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

export default withColumnWidth(Header);
