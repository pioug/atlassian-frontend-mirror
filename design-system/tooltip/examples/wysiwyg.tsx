import React from 'react';

import { styled } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import CodeIcon from '@atlaskit/icon/core/angle-brackets';
import LinkIcon from '@atlaskit/icon/core/link';
import BulletListIcon from '@atlaskit/icon/core/list-bulleted';
import NumberListIcon from '@atlaskit/icon/core/list-numbered';
import BoldIcon from '@atlaskit/icon/core/text-bold';
import ItalicIcon from '@atlaskit/icon/core/text-italic';
import TextUnderlineIcon from '@atlaskit/icon/core/text-underline';
import { Flex } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

const iconSpacingStyles = cssMap({
	space050: {
		paddingBlock: token('space.050'),
		paddingInline: token('space.050'),
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Toolbar = styled.div({
	backgroundColor: token('color.background.neutral'),
	borderRadius: token('radius.small', '3px'),
	display: 'flex',
	padding: '5px',
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Action = styled.button({
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('radius.small', '3px'),
	display: 'flex',
	height: '24px',
	justifyContent: 'center',
	marginRight: '3px',
	width: '36px',
	'&:hover': {
		backgroundColor: token('color.background.neutral.hovered'),
	},
});

const ACTIONS: { [key: string]: React.ReactElement } = {
	Bold: (
		<Flex xcss={iconSpacingStyles.space050}>
			<BoldIcon label="Bold" />
		</Flex>
	),
	Italic: (
		<Flex xcss={iconSpacingStyles.space050}>
			<ItalicIcon label="Italic" />
		</Flex>
	),
	Underline: (
		<Flex xcss={iconSpacingStyles.space050}>
			<TextUnderlineIcon label="Underline" />
		</Flex>
	),
	Link: (
		<Flex xcss={iconSpacingStyles.space050}>
			<LinkIcon label="Link" />
		</Flex>
	),
	'Bullet List': (
		<Flex xcss={iconSpacingStyles.space050}>
			<BulletListIcon label="Bullet List" />
		</Flex>
	),
	'Number List': (
		<Flex xcss={iconSpacingStyles.space050}>
			<NumberListIcon label="Number List" />
		</Flex>
	),
	Source: (
		<Flex xcss={iconSpacingStyles.space050}>
			<CodeIcon label="Source" />
		</Flex>
	),
};

export default function WysiwygExample(): React.JSX.Element {
	return (
		<Toolbar>
			{Object.keys(ACTIONS).map((a) => (
				<Tooltip key={a} content={a} position="top">
					{(tooltipProps) => <Action {...tooltipProps}>{ACTIONS[a]}</Action>}
				</Tooltip>
			))}
		</Toolbar>
	);
}
