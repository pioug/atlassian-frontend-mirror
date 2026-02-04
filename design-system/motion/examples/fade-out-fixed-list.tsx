/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useState } from 'react';

import { jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
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

const Card = ({ icon, text }: { icon: React.ReactNode; text: React.ReactNode }) => (
	<FadeIn>
		{(props) => (
			<li
				ref={props.ref}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
				className={props.className}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
				style={props.style}
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={{
					display: 'block',
					padding: 0,
					margin: token('space.100', '8px'),
				}}
			>
				<Block
					css={{
						width: '100%',
						height: '48px',
						borderRadius: token('radius.small', '3px'),
					}}
				>
					<div
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						css={{
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							paddingLeft: token('space.100', '8px'),
						}}
					>
						{icon}
						<h3
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
							css={{
								margin: 0,
								fontWeight: 300,
								marginLeft: token('space.100', '8px'),
							}}
						>
							{text}
						</h3>
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
			<div
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={{
					textAlign: 'center',
					'> *': { marginRight: token('space.050', '4px') },
				}}
			>
				<Button onClick={() => setItems((list) => list - 1)}>Remove</Button>
				<Button onClick={() => setItems(6)}>Reset</Button>

				<ul
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					css={{
						maxWidth: '474px',
						padding: 0,
						margin: `${token('space.200', '16px')} auto !important`,
						div: { margin: '0' },
					}}
				>
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
