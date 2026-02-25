/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import Heading from '@atlaskit/heading';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraServiceManagementIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { ExitingPersistence, FadeIn, StaggeredEntrance } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, RetryContainer } from './utils';

const buttonContainerStyles = css({
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': { marginInlineEnd: token('space.050', '4px') },
});

const ulStyles = css({
	maxWidth: '474px',
	padding: 0,
	marginBlockEnd: token('space.200', '16px'),
	marginBlockStart: token('space.200', '16px'),
	marginInlineEnd: 'auto',
	marginInlineStart: 'auto',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	div: { margin: '0' },
});

const liStyles = css({
	display: 'block',
	padding: 0,
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.100', '8px'),
	marginInlineEnd: token('space.100', '8px'),
	marginInlineStart: token('space.100', '8px'),
});

const innerDivStyles = css({
	display: 'flex',
	width: '100%',
	alignItems: 'center',
	paddingInlineStart: token('space.100', '8px'),
});

const Card = ({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) => (
	<FadeIn>
		{(props) => (
			<li
				ref={props.ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={props.className}
				style={props.style}
				css={liStyles}
			>
				<Block
					css={{
						width: '100%',
						height: '48px',
						borderRadius: token('radius.small', '3px'),
					}}
				>
					<div css={innerDivStyles}>
						{icon}
						<Heading as="h3" size="small">
							{text}
						</Heading>
					</div>
				</Block>
			</li>
		)}
	</FadeIn>
);

export default (): JSX.Element => {
	const [count, setItems] = useState(6);

	return (
		<RetryContainer>
			<div css={buttonContainerStyles}>
				<Button onClick={() => setItems((list) => list - 1)}>Remove</Button>
				<Button onClick={() => setItems(6)}>Reset</Button>

				<ul css={ulStyles}>
					<StaggeredEntrance>
						<ExitingPersistence appear>
							{count > 0 && <Card icon={<BitbucketIcon size="small" />} text="Bitbucket" />}
							{count > 2 && <Card icon={<ConfluenceIcon size="small" />} text="Confluence" />}
							{count > 1 && (
								<Card
									icon={<JiraServiceManagementIcon size="small" />}
									text="Jira Service Management"
								/>
							)}
							{count > 4 && <Card icon={<JiraSoftwareIcon size="small" />} text="Jira Software" />}
							{count > 5 && <Card icon={<OpsgenieIcon size="small" />} text="Opsgenie" />}
							{count > 3 && <Card icon={<StatuspageIcon size="small" />} text="Statuspage" />}
						</ExitingPersistence>
					</StaggeredEntrance>
				</ul>
			</div>
		</RetryContainer>
	);
};
