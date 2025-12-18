import React from 'react';

import { styled } from '@compiled/react';

import CodeIcon from '@atlaskit/icon/core/angle-brackets';
import LinkIcon from '@atlaskit/icon/core/link';
import BulletListIcon from '@atlaskit/icon/core/list-bulleted';
import NumberListIcon from '@atlaskit/icon/core/list-numbered';
import BoldIcon from '@atlaskit/icon/core/text-bold';
import ItalicIcon from '@atlaskit/icon/core/text-italic';
import TextUnderlineIcon from '@atlaskit/icon/core/text-underline';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

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
	Bold: <BoldIcon spacing="spacious" label="Bold" />,
	Italic: <ItalicIcon spacing="spacious" label="Italic" />,
	Underline: <TextUnderlineIcon spacing="spacious" label="Underline" />,
	Link: <LinkIcon spacing="spacious" label="Link" />,
	'Bullet List': <BulletListIcon spacing="spacious" label="Bullet List" />,
	'Number List': <NumberListIcon spacing="spacious" label="Number List" />,
	Source: <CodeIcon spacing="spacious" label="Source" />,
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
