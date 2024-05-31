/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/** @jsx jsx */
import React, { Fragment } from 'react';

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const container: any = css({
	width: '100%',
	borderBottom: '1px solid #333',
});

const heading: any = css({
	lineHeight: '1.7em',
	textAlign: 'center',
	color: 'black',
	fontSize: '1.2em',
	fontWeight: 'bold',
	userSelect: 'none',
	position: 'sticky',
	top: 0,
	background: '#c00',
	borderBottom: '1px solid #333',
});

const errorStyle: any = css({
	padding: token('space.400', '32px'),
	fontFamily: 'monospace',
	whiteSpace: 'pre-wrap',
	background: 'red',
});

type ExamplesErrorBoundaryState = {
	error: { error: Error; stack: string } | undefined;
};

export default class ExamplesErrorBoundary extends React.Component<
	any,
	ExamplesErrorBoundaryState
> {
	state: ExamplesErrorBoundaryState = {
		error: undefined,
	};

	componentDidCatch(error: Error, info: { componentStack: string }) {
		this.setState({ error: { error, stack: info.componentStack } });
	}

	render() {
		const { error } = this.state;
		if (error) {
			const { error: errorMessage, stack } = error;
			return (
				<Fragment>
					<div css={container}>
						<div css={heading}>💣💥</div>
						<div css={errorStyle}>{`${errorMessage.toString()}\n${stack}`}</div>
					</div>
				</Fragment>
			);
		}
		return this.props.children;
	}
}
