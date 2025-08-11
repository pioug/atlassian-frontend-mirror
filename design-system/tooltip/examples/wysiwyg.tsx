import React from 'react';

import { styled } from '@compiled/react';

import BoldIcon from '@atlaskit/icon/glyph/editor/bold';
import BulletListIcon from '@atlaskit/icon/glyph/editor/bullet-list';
import CodeIcon from '@atlaskit/icon/glyph/editor/code';
import ItalicIcon from '@atlaskit/icon/glyph/editor/italic';
import LinkIcon from '@atlaskit/icon/glyph/editor/link';
import NumberListIcon from '@atlaskit/icon/glyph/editor/number-list';
import UnderlineIcon from '@atlaskit/icon/glyph/editor/underline';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Toolbar = styled.div({
	backgroundColor: token('color.background.neutral'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: `${borderRadius()}px`,
	display: 'flex',
	padding: '5px',
});
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
const Action = styled.button({
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/design-system/no-unsafe-design-token-usage
	borderRadius: token('border.radius.100', '3px'),
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
	Bold: <BoldIcon label="Bold" />,
	Italic: <ItalicIcon label="Italic" />,
	Underline: <UnderlineIcon label="Underline" />,
	Link: <LinkIcon label="Link" />,
	'Bullet List': <BulletListIcon label="Bullet List" />,
	'Number List': <NumberListIcon label="Number List" />,
	Source: <CodeIcon label="Source" />,
};

export default function WysiwygExample() {
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
