/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { css, jsx } from '@compiled/react';

import ExitingPersistence from '@atlaskit/motion/exiting-persistence';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import ZoomIn from '@atlaskit/motion/zoom-in';

import { Block } from '../utils/blocks';
import { Centered, RetryContainer } from '../utils/containers';

const MotionZoomInExample = (): JSX.Element => {
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
