/**
 * @jsxRuntime classic
 */
/** @jsx jsx */
import React, { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';

import { ExitingPersistence, StaggeredEntrance, ZoomIn } from '../src';

import { Block, Centered, RetryContainer } from './utils';

export default () => {
	const [isIn, setIsIn] = useState(true);

	return (
		<RetryContainer>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ textAlign: 'center' }}>
				<Button onClick={() => setIsIn((prev) => !prev)}>{isIn ? 'Exit' : 'Enter'}</Button>
			</div>

			<Centered css={{ height: '82px' }}>
				<StaggeredEntrance>
					<ExitingPersistence appear>
						{isIn && (
							<React.Fragment>
								<ZoomIn>{(props) => <Block {...props} appearance="small" />}</ZoomIn>
								<ZoomIn>{(props) => <Block {...props} appearance="small" />}</ZoomIn>
								<ZoomIn>{(props) => <Block {...props} appearance="small" />}</ZoomIn>
							</React.Fragment>
						)}
					</ExitingPersistence>
				</StaggeredEntrance>
			</Centered>
		</RetryContainer>
	);
};
