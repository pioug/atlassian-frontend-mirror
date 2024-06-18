/** @jsx jsx */
import React from 'react';
import { token } from '@atlaskit/tokens';
import { components, type ControlProps } from '@atlaskit/select';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { N200 } from '@atlaskit/theme/colors';

const spacing = 8;
const fontSize = 12;
const innerHeight = spacing * 2; // 16px
const lineHeight = innerHeight / fontSize;

const controlWrapper = css({
	display: 'flex',
	flexDirection: 'column',
	padding: `0px ${token('space.100', '8px')} ${token('space.100', '8px')}`,
});

const getLabelStyle = () =>
	css({
		color: token('color.text.subtlest', N200),
		fontSize: `${fontSize}px`,
		fontWeight: 600,
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		lineHeight: `${lineHeight}`,
		paddingBottom: token('space.050', '4px'),
		paddingLeft: token('space.0', '0px'),
		paddingRight: token('space.0', '0px'),
		paddingTop: token('space.250', '20px'),
	});

export class PopupControl extends React.PureComponent<ControlProps<any>> {
	render() {
		const {
			selectProps: { popupTitle },
		} = this.props;

		return (
			<div css={controlWrapper}>
				{/* eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div css={getLabelStyle()}>{popupTitle}</div>
				<components.Control {...this.props} />
			</div>
		);
	}
}
