/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';
import { token } from '@atlaskit/tokens';
import {
	createFileDetails,
	createIdentifier,
	FileStateFactory,
} from '@atlaskit/media-test-helpers';
import { MainWrapper } from '../example-helpers';
import { Card } from '../src/card/card';
import { MediaClientContext } from '@atlaskit/media-client-react';
import { jsx } from '@compiled/react';
import { css } from '@compiled/react';

const testButtonStyles = css({
	width: '100%',
	height: '100%',
	boxSizing: 'border-box',
});

const wrapperStyles = css({
	boxSizing: 'border-box',
	height: '100vh',
	display: 'flex',
	justifyContent: 'center',
	flexWrap: 'wrap',
});

const clickCountsButtonStyles = css({
	position: 'absolute',
	zIndex: 200,
	alignSelf: 'center',
	justifySelf: 'center',
	fontSize: '3rem',
	backgroundColor: token('elevation.surface.overlay', 'white'),
	paddingTop: token('space.600', '3rem'),
	paddingRight: token('space.600', '3rem'),
	paddingBottom: token('space.600', '3rem'),
	paddingLeft: token('space.600', '3rem'),
	border: 'none',
	cursor: 'pointer',
});

const itemDivStyles = css({
	width: '20%',
});
const identifier = createIdentifier();
const fileStateFactory = new FileStateFactory(identifier, {
	fileDetails: createFileDetails(identifier.id, 'image'),
});
fileStateFactory.next('processed');

export default () => {
	const [clickCount, setClickCount] = useState(0);
	const renderCardsAt = [0, 2, 4, 20, 24, 40, 42, 44];
	const TestButton = ({ children }: { children: React.ReactNode }) => {
		return (
			<button
				css={testButtonStyles}
				onClick={() => setClickCount((prevclickCount) => prevclickCount + 1)}
			>
				{children}
			</button>
		);
	};

	return (
		<MediaClientContext.Provider value={fileStateFactory.mediaClient}>
			<MainWrapper disableFeatureFlagWrapper={true} developmentOnly>
				<div css={wrapperStyles} id="wrapper">
					<button
						id="clickCounts"
						css={clickCountsButtonStyles}
						onClick={() => setClickCount(clickCount + 1)}
					>
						{clickCount}
					</button>
					{Array(45)
						.fill('button')
						.map((value, index) => {
							const id = `${value}-${index}`;
							return (
								<div css={itemDivStyles} key={id} id={`itemNumber${index}`}>
									{renderCardsAt.includes(index) ? (
										<Card
											mediaClient={fileStateFactory.mediaClient}
											identifier={identifier}
											dimensions={{ width: '100%', height: '100%' }}
										/>
									) : (
										<TestButton key={id}>{id}</TestButton>
									)}
								</div>
							);
						})}
				</div>
			</MainWrapper>
		</MediaClientContext.Provider>
	);
};
