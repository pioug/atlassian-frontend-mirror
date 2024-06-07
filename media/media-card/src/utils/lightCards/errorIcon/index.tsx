/**@jsx jsx */
import { jsx } from '@emotion/react';
import { Component } from 'react';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';

import { errorIconWrapperStyles } from './styles';

export interface ErrorIconProps {
	readonly size: 'small' | 'medium' | 'large' | 'xlarge';
}
export class ErrorIcon extends Component<ErrorIconProps, {}> {
	static defaultProps = {
		size: 'small',
	};

	render() {
		const { size } = this.props;

		return (
			<div css={errorIconWrapperStyles}>
				<WarningIcon label="Error" size={size} />
			</div>
		);
	}
}
