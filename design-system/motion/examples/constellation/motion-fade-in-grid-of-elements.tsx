/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { cloneElement, useState } from 'react';

import { css, jsx } from '@compiled/react';

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

const MotionFadeInGridOfElementsExample = (): JSX.Element => {
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
										<li
											ref={props.ref}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
											className={props.className}
											style={props.style}
											css={listItemStyles}
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
	'> *': {
		marginBlockEnd: token('space.025'),
		marginBlockStart: token('space.025'),
		marginInlineEnd: token('space.025'),
		marginInlineStart: token('space.025'),
	},
});

const listStyles = css({
	display: 'flex',
	maxWidth: '474px',
	justifyContent: 'flex-start',
	flexWrap: 'wrap',
	marginBlockEnd: token('space.200'),
	marginBlockStart: token('space.200'),
	marginInlineEnd: token('space.200'),
	marginInlineStart: token('space.200'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
	div: {
		marginBlockEnd: token('space.0'),
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginInlineStart: token('space.0'),
	},
});

const listItemStyles = css({
	display: 'block',
	marginBlockEnd: token('space.050'),
	marginBlockStart: token('space.050'),
	marginInlineEnd: token('space.050'),
	marginInlineStart: token('space.050'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
});

export default MotionFadeInGridOfElementsExample;
