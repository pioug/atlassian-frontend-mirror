/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { token } from '@atlaskit/tokens';
import { components, type ControlProps } from '@atlaskit/select';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import { N200 } from '@atlaskit/theme/colors';

const controlWrapper = css({
	display: 'flex',
	flexDirection: 'column',
	padding: `0px ${token('space.100', '8px')} ${token('space.100', '8px')}`,
});

const labelStyle = css({
	color: token('color.text.subtlest', N200),
	font: token('font.body.UNSAFE_small'),
	fontWeight: token('font.weight.semibold'),
	paddingBottom: token('space.050', '4px'),
	paddingLeft: token('space.0', '0px'),
	paddingRight: token('space.0', '0px'),
	paddingTop: token('space.250', '20px'),
});

export class PopupControl extends React.PureComponent<ControlProps<any>> {
	render() {
		const {
			//@ts-ignore react-select unsupported props
			selectProps: { popupTitle },
		} = this.props;

		return (
			<div css={controlWrapper}>
				<div css={labelStyle}>{popupTitle}</div>
				<components.Control {...this.props} />
			</div>
		);
	}
}
