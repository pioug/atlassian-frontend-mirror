/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { token } from '@atlaskit/tokens';
import { type ControlProps } from '@atlaskit/select';
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import Control from './Control';
import type { UserPickerProps } from '../types';

const controlWrapper = css({
	display: 'flex',
	flexDirection: 'column',
	padding: `0px ${token('space.100')} ${token('space.100')}`,
});

const labelStyle = css({
	color: token('color.text.subtlest'),
	font: token('font.body.small'),
	fontWeight: token('font.weight.semibold'),
	paddingBottom: token('space.050'),
	paddingLeft: token('space.0'),
	paddingRight: token('space.0'),
	paddingTop: token('space.250'),
});

export class PopupControl extends React.PureComponent<ControlProps<any> & UserPickerProps> {
	render(): React.JSX.Element {
		const {
			//@ts-ignore react-select unsupported props
			selectProps: { popupTitle },
		} = this.props;

		return (
			<div css={controlWrapper}>
				<div css={labelStyle}>{popupTitle}</div>
				<Control {...this.props} />
			</div>
		);
	}
}
