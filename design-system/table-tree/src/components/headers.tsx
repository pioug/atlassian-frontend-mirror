/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
/* eslint-disable @repo/internal/react/no-clone-element */
import { Children, cloneElement, Component } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const containerStyles = css({
	display: 'flex',
	borderBlockEnd: `solid 2px ${token('color.border', '#dfe1e6')}`,
});

export default class Headers extends Component<any> {
	render() {
		return (
			// TODO: Determine whether proper `tr` elements can be used instead of
			// roles (DSP-11588)
			<div css={containerStyles} role="row">
				{Children.map(this.props.children, (header, index) =>
					// eslint-disable-next-line react/no-array-index-key
					cloneElement(header as any, { key: index, columnIndex: index }),
				)}
			</div>
		);
	}
}
