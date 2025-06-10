/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';

import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraServiceManagementIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { FadeIn, StaggeredEntrance } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block, RetryContainer } from './utils';

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraServiceManagementIcon size="small" />, 'Jira Management Desk'],
	[<JiraSoftwareIcon size="small" />, 'Jira Software'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

export default () => {
	return (
		<RetryContainer>
			<ul
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={{
					maxWidth: '474px',
					padding: 0,
					margin: `${token('space.200', '16px')} auto !important`,
					div: { margin: '0' },
				}}
			>
				{/* Hard code columns to 1 for extra perf. */}
				<StaggeredEntrance columns={1}>
					{logos.map((logo, index) => (
						<FadeIn key={index}>
							{(props) => (
								<li
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
											borderRadius: token('border.radius.100', '3px'),
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
											{logo[0]}
											<h3
												// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
												css={{
													margin: 0,
													fontWeight: 300,
													marginLeft: token('space.100', '8px'),
												}}
											>
												{logo[1]}
											</h3>
										</div>
									</Block>
								</li>
							)}
						</FadeIn>
					))}
				</StaggeredEntrance>
			</ul>
		</RetryContainer>
	);
};
