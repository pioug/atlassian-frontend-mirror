/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cloneElement, useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { JiraSoftwareIcon } from '@atlaskit/logo/jira-software-icon';
import { JiraWorkManagementIcon } from '@atlaskit/logo/jira-work-management/icon';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraIcon,
	JiraServiceManagementIcon,
	OpsgenieIcon,
	StatuspageIcon,
	TrelloIcon,
} from '@atlaskit/logo';
import FadeIn from '@atlaskit/motion/fade-in';
import StaggeredEntrance from '@atlaskit/motion/staggered-entrance';
import { token } from '@atlaskit/tokens';

import { Block } from './utils/blocks';
import { RetryContainer } from './utils/containers';

const buttonContainerStyles = css({
	textAlign: 'center',
});

const ulStyles = css({
	display: 'flex',
	maxWidth: '546px',
	padding: 0,
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	marginBlockEnd: token('space.200'),
	marginBlockStart: token('space.200'),
	marginInlineEnd: 'auto',
	marginInlineStart: 'auto',
});

const liStyles = css({
	display: 'block',
	margin: 0,
	padding: 0,
});

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

export default (): JSX.Element => {
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
				<ul css={ulStyles}>
					<StaggeredEntrance columns="responsive">
						{Array(state.numOfChildren)
							.fill(undefined)
							.map((_, index) => (
								<FadeIn key={index}>
									{(props) => (
										<li
											ref={props.ref}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
											className={props.className}
											style={props.style}
											css={liStyles}
										>
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
