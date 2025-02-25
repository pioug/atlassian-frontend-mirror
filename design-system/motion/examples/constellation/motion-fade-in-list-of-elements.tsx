/* eslint-disable @atlaskit/ui-styling-standard/no-nested-selectors */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@compiled/react';

import Button from '@atlaskit/button/new';
import {
	BitbucketIcon,
	ConfluenceIcon,
	JiraIcon,
	JiraServiceManagementIcon,
	StatuspageIcon,
	TrelloIcon,
} from '@atlaskit/logo';
import { FadeIn, StaggeredEntrance } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block } from '../utils';

const MotionFadeInListOfElementsExample = () => {
	const [items, setItems] = useState(logos);

	return (
		<div css={retryContainerStyles}>
			<Button onClick={() => setItems((list) => randRemove(list))}>Random remove</Button>
			<Button onClick={() => setItems(logos)}>Reset</Button>

			<ul css={listStyles}>
				<StaggeredEntrance>
					{items.map((logo) => (
						// Gotcha #1 set propery keys YO
						<FadeIn key={logo[1] as string}>
							{(props) => (
								<li
									ref={props.ref}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
									className={props.className}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
									style={props.style}
									css={listItemStyles}
								>
									<Block css={blockStyles}>
										<div css={logoContainerStyles}>
											{logo[0]}
											<h3 css={headerStyles}>{logo[1]}</h3>
										</div>
									</Block>
								</li>
							)}
						</FadeIn>
					))}
				</StaggeredEntrance>
			</ul>
		</div>
	);
};

const logos = [
	[<BitbucketIcon size="small" />, 'Bitbucket'],
	[<ConfluenceIcon size="small" />, 'Confluence'],
	[<JiraServiceManagementIcon size="small" />, 'Jira Service Management'],
	[<JiraIcon size="small" />, 'Jira'],
	[<TrelloIcon size="small" />, 'Trello'],
	[<StatuspageIcon size="small" />, 'Statuspage'],
];

const randRemove = <T extends Array<TItem>, TItem>(arr: T) => {
	const newArr = arr.concat([]);
	newArr.splice(Date.now() % newArr.length, 1);
	return newArr;
};

const retryContainerStyles = css({
	textAlign: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> *': {
		marginInlineEnd: token('space.050', '4px'),
	},
});

const listStyles = css({
	maxWidth: '474px',
	height: '328px',
	marginBlockEnd: token('space.200', '16px'),
	marginBlockStart: token('space.200', '16px'),
	marginInlineEnd: token('space.200', '16px'),
	marginInlineStart: token('space.200', '16px'),
	paddingBlockEnd: token('space.0', '0px'),
	paddingBlockStart: token('space.0', '0px'),
	paddingInlineEnd: token('space.0', '0px'),
	paddingInlineStart: token('space.0', '0px'),
	div: {
		marginBlockEnd: token('space.0', '0px'),
		marginBlockStart: token('space.0', '0px'),
		marginInlineEnd: token('space.0', '0px'),
		marginInlineStart: token('space.0', '0px'),
	},
});

const listItemStyles = css({
	display: 'block',
	marginBlockEnd: token('space.100', '8px'),
	marginBlockStart: token('space.100', '8px'),
	marginInlineEnd: token('space.100', '8px'),
	marginInlineStart: token('space.100', '8px'),
	paddingBlockEnd: token('space.0', '0px'),
	paddingBlockStart: token('space.0', '0px'),
	paddingInlineEnd: token('space.0', '0px'),
	paddingInlineStart: token('space.0', '0px'),
});

const blockStyles = css({
	width: '100%',
	height: '48px',
	borderRadius: '3px',
});

const logoContainerStyles = css({
	display: 'flex',
	width: '100%',
	alignItems: 'center',
	paddingInlineStart: token('space.100', '8px'),
});

const headerStyles = css({
	fontWeight: 300,
	marginBlockEnd: token('space.0', '0px'),
	marginBlockStart: token('space.0', '0px'),
	marginInlineEnd: token('space.0', '0px'),
	marginInlineStart: token('space.100', '8px'),
});

export default MotionFadeInListOfElementsExample;
