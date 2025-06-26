/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { forbiddenJira as JiraPreviewImage } from '@atlaskit/link-test-helpers';
import { token } from '@atlaskit/tokens';

import { BlockCard } from '../../src/view/BlockCard';
import { getCardState, type GetCardStateProps } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

const outerStyles = css({
	width: '80%',
});

const innerStyles = css({
	paddingTop: token('space.400'),
	paddingRight: token('space.400'),
	paddingBottom: token('space.400'),
	paddingLeft: token('space.400'),
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
				<div css={outerStyles}>
					{/* eslint-disable-next-line @atlaskit/design-system/use-primitives */}
					<div css={innerStyles}>
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
				</div>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
