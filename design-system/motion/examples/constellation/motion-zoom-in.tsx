/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import { ExitingPersistence, StaggeredEntrance, ZoomIn } from '@atlaskit/motion';

import { Block, Centered, RetryContainer } from '../utils';

const MotionZoomInExample = () => {
	return (
		<RetryContainer>
			<div css={containerStyles}></div>

			<Centered css={centeredStyles}>
				<StaggeredEntrance>
					<ExitingPersistence appear>
						<React.Fragment>
							<ZoomIn>{(props) => <Block {...props} appearance="small" />}</ZoomIn>
							<ZoomIn>{(props) => <Block {...props} appearance="small" />}</ZoomIn>
							<ZoomIn>{(props) => <Block {...props} appearance="small" />}</ZoomIn>
						</React.Fragment>
					</ExitingPersistence>
				</StaggeredEntrance>
			</Centered>
		</RetryContainer>
	);
};

const containerStyles = css({ textAlign: 'center' });

const centeredStyles = css({ height: '82px' });

export default MotionZoomInExample;
