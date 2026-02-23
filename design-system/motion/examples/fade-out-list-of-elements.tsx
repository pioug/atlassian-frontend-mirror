/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

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
});

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
	marginInlineStart: token('space.100', '8px'),
});

const innerDivStyles = css({
	display: 'flex',
	width: '100%',
	alignItems: 'center',
	paddingInlineStart: token('space.100', '8px'),
});

const blockStyles = css({
	width: '100%',
	height: '48px',
	borderRadius: token('radius.small', '3px'),
});

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraServiceManagementIcon size="small" />, 'Jira Service Management'],
	[<JiraSoftwareIcon size="small" />, 'Jira Software'],
	[<OpsgenieIcon size="small" />, 'Opsgenie'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

const randRemove = <T extends Array<TItem>, TItem>(arr: T) => {
	const newArr = arr.concat([]);
	newArr.splice(Date.now() % newArr.length, 1);
	return newArr;
};

export default (): JSX.Element => {
	const [items, setItems] = useState(logos);

	return (
		<RetryContainer>
			<div css={buttonContainerStyles}>
				<Button onClick={() => setItems((list) => randRemove(list))}>Random remove</Button>
				<Button onClick={() => setItems(logos)}>Reset</Button>

				<ul css={ulStyles}>
					<StaggeredEntrance>
						<ExitingPersistence appear>
							{items.map((logo) => (
								// Gotcha #1 set property keys YO
								<FadeIn key={logo[1] as string}>
									{(props) => (
										<li
											ref={props.ref}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
											className={props.className}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
											style={props.style}
											css={liStyles}
										>
											<Block
												css={blockStyles}>
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
						</ExitingPersistence>
					</StaggeredEntrance>
				</ul>
			</div>
		</RetryContainer>
	);
};
