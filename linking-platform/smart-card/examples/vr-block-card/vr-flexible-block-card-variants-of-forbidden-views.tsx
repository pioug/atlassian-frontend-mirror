import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import styled from '@emotion/styled';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { token } from '@atlaskit/tokens';

import JiraPreviewImage from '../../examples/images/forbidden-jira.svg';
import { BlockCard } from '../../src/view/BlockCard';
import { getCardState, type GetCardStateProps } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Container = styled.div({
	width: '80%',
});

const getMetadata = (accessType?: string) => {
	return {
		requestAccess: { accessType: accessType },
	};
};

export const BlockCardForbiddenViews = () => {
	const mockUrl = 'https://some-url.com';
	const commonState: GetCardStateProps = {
		data: { url: mockUrl, image: JiraPreviewImage },
		status: 'forbidden',
	};

	return (
		<VRTestWrapper>
			<SmartCardProvider>
				<Container>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<div style={{ padding: token('space.400', '32px') }}>
						<h5>Default Forbidden view </h5>
						<BlockCard
							cardState={getCardState(commonState)}
							url={mockUrl}
							handleAuthorize={() => {}}
							handleFrameClick={() => {}}
							id={'12344'}
							testId={'default-forbidden-view'}
						/>
						<h5>Forbidden view with 'DIRECT_ACCESS' </h5>
						<BlockCard
							cardState={getCardState({
								...commonState,
								meta: getMetadata('DIRECT_ACCESS'),
							})}
							url={mockUrl}
							handleAuthorize={() => {}}
							handleFrameClick={() => {}}
							id={'12344'}
							testId={'direct-access-forbidden-view'}
						/>
						<h5>Forbidden view with 'REQUEST_ACCESS' </h5>
						<BlockCard
							cardState={getCardState({
								...commonState,
								meta: getMetadata('REQUEST_ACCESS'),
							})}
							url={mockUrl}
							handleAuthorize={() => {}}
							handleFrameClick={() => {}}
							id={'12344'}
							testId={'request-access-forbidden-view'}
						/>
						<h5>Forbidden view with 'PENDING_REQUEST_EXISTS' </h5>
						<BlockCard
							cardState={getCardState({
								...commonState,
								meta: getMetadata('PENDING_REQUEST_EXISTS'),
							})}
							url={mockUrl}
							handleAuthorize={() => {}}
							handleFrameClick={() => {}}
							id={'12344'}
							testId={'pending-request-forbidden-view'}
						/>
						<h5>Forbidden view with 'FORBIDDEN' </h5>
						<BlockCard
							cardState={getCardState({
								...commonState,
								meta: getMetadata('FORBIDDEN'),
							})}
							url={mockUrl}
							handleAuthorize={() => {}}
							handleFrameClick={() => {}}
							id={'12344'}
							testId={'forbidden-forbidden-view'}
						/>
						<h5>Forbidden view with 'DENIED_REQUEST_EXISTS' </h5>
						<BlockCard
							cardState={getCardState({
								...commonState,
								meta: getMetadata('DENIED_REQUEST_EXISTS'),
							})}
							url={mockUrl}
							handleAuthorize={() => {}}
							handleFrameClick={() => {}}
							id={'12344'}
							testId={'denied-request-forbidden-view'}
						/>
					</div>
				</Container>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
