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
	JiraServiceManagementIcon,
	JiraSoftwareIcon,
	OpsgenieIcon,
	StatuspageIcon,
} from '@atlaskit/logo';
import { ExitingPersistence, FadeIn, StaggeredEntrance } from '@atlaskit/motion';
import { token } from '@atlaskit/tokens';

import { Block } from '../utils';

const MotionFadeOutListOfElementsExample = () => {
	const [items, setItems] = useState(logos);

	return (
		<div css={retryContainerStyles}>
			<Button onClick={() => setItems((list) => randRemove(list))}>Random remove</Button>
			<Button onClick={() => setItems(logos)}>Reset</Button>

			<ul css={listStyles}>
				<StaggeredEntrance>
					<ExitingPersistence appear>
						{items.map((logo) => (
							// Gotcha #1 set propery keys YO
							<FadeIn key={logo[1] as string}>
								{(props) => (
									<li
										ref={props.ref}
										// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
										className={props.className}
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
					</ExitingPersistence>
				</StaggeredEntrance>
			</ul>
		</div>
	);
};

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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
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

export default MotionFadeOutListOfElementsExample;
