/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import Heading from '@atlaskit/heading';
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

const ulStyles = css({
	maxWidth: '474px',
	padding: 0,
	marginBlockEnd: token('space.200', '16px'),
	marginBlockStart: token('space.200', '16px'),
	marginInlineEnd: 'auto',
	marginInlineStart: 'auto',
});

const liStyles = css({
	display: 'block',
	padding: 0,
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.100', '8px'),
	marginInlineEnd: token('space.100', '8px'),
	marginInlineStart: token('space.100', '8px')
});

const innerDivStyles = css({
	display: 'flex',
	width: '100%',
	alignItems: 'center',
	paddingInlineStart: token('space.100', '8px')
});

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraServiceManagementIcon size="small" />, 'Jira Management Desk'],
	[<JiraSoftwareIcon size="small" />, 'Jira Software'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

export default (): JSX.Element => {
	return (
		<RetryContainer>
			<ul css={ulStyles}>
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
											{logo[0]}
											<Heading as="h3" size="small">
												{logo[1]}
											</Heading>
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
