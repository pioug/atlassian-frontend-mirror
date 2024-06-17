/** @jsx jsx */
import { cloneElement, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button/new';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraIcon,
	JiraServiceManagementIcon,
	JiraSoftwareIcon,
	JiraWorkManagementIcon,
	OpsgenieIcon,
	StatuspageIcon,
	TrelloIcon,
} from '@atlaskit/logo';
import { FadeIn, StaggeredEntrance } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, RetryContainer } from '../utils';

const MotionFadeInGridOfElementsExample = () => {
	const [state, setState] = useState(() => ({
		size: 'medium' as any,
		numOfChildren: 9,
	}));

	return (
		<div>
			<div css={buttonContainerStyles}>
				{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 20, 30, 50, 80].map((num) => (
					<Button
						key={num}
						isSelected={num === state.numOfChildren}
						onClick={() => {
							setState({
								size: num > 9 ? 'small' : 'medium',
								numOfChildren: num,
							});
						}}
					>
						{num}
					</Button>
				))}
			</div>

			<RetryContainer key={state.numOfChildren}>
				<ul css={listStyles}>
					<StaggeredEntrance columns="responsive">
						{Array(state.numOfChildren)
							.fill(undefined)
							.map((_, index) => (
								<FadeIn key={index}>
									{(props) => (
										<li {...props} css={listItemStyles}>
											<Block appearance={state.size}>
												{/* eslint-disable-next-line @repo/internal/react/no-clone-element */}
												{cloneElement(logos[index % logos.length], {
													size: state.numOfChildren > 9 ? 'small' : 'xlarge',
												})}
											</Block>
										</li>
									)}
								</FadeIn>
							))}
					</StaggeredEntrance>
				</ul>
			</RetryContainer>
		</div>
	);
};

const logos = [
	<BitbucketIcon size="xlarge" />,
	<ConfluenceIcon size="xlarge" />,
	<JiraServiceManagementIcon size="xlarge" />,
	<JiraIcon size="xlarge" />,
	<JiraSoftwareIcon size="xlarge" />,
	<JiraWorkManagementIcon size="xlarge" />,
	<OpsgenieIcon size="xlarge" />,
	<StatuspageIcon size="xlarge" />,
	<TrelloIcon size="xlarge" />,
];

const buttonContainerStyles = css({
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		margin: token('space.025', '2px'),
	},
});

const listStyles = css({
	display: 'flex',
	maxWidth: '474px',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-important-styles -- Ignored via go/DSP-18766
	margin: `${token('space.200', '16px')} !important`,
	padding: token('space.0', '0px'),
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	div: {
		margin: token('space.0', '0px'),
	},
});

const listItemStyles = css({
	display: 'block',
	margin: token('space.050', '4px'),
	padding: token('space.0', '0px'),
});

export default MotionFadeInGridOfElementsExample;
