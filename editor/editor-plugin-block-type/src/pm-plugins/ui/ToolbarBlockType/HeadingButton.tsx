/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-values */
/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css } from '@compiled/react';
import { useIntl } from 'react-intl-next';

import { jsx, cssMap } from '@atlaskit/css';
import { INPUT_METHOD } from '@atlaskit/editor-common/analytics';
import {
	formatShortcut,
	type Keymap,
	setNormalText,
	toggleHeading1,
	toggleHeading2,
	toggleHeading3,
	toggleHeading4,
	toggleHeading5,
	toggleHeading6,
} from '@atlaskit/editor-common/keymaps';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { editorUGCToken } from '@atlaskit/editor-common/ugc-tokens';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { ToolbarDropdownItem, ToolbarKeyboardShortcutHint } from '@atlaskit/editor-toolbar';
import { Box } from '@atlaskit/primitives/compiled';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { BlockTypePlugin } from '../../../blockTypePluginType';
import type { TextBlockTypes } from '../../block-types';
import type { BlockTypeWithRank } from '../../types';

type HeadingButtonProps = {
	api?: ExtractInjectionAPI<BlockTypePlugin>;
	blockType: BlockTypeWithRank;
};

type HeadingName =
	| 'normal'
	| 'heading1'
	| 'heading2'
	| 'heading3'
	| 'heading4'
	| 'heading5'
	| 'heading6';

const normalStyle = css({
	font: editorUGCToken('editor.font.body'),
});

const heading1Style = css({
	font: editorUGCToken('editor.font.heading.h1'),
});

const heading2Style = css({
	font: editorUGCToken('editor.font.heading.h2'),
});

const heading3Style = css({
	font: editorUGCToken('editor.font.heading.h3'),
});

const heading4Style = css({
	font: editorUGCToken('editor.font.heading.h4'),
});

const heading5Style = css({
	font: editorUGCToken('editor.font.heading.h5'),
});

const heading6Style = css({
	font: editorUGCToken('editor.font.heading.h6'),
});

type HeadingTextProps = {
	children: React.ReactNode;
	headingType: HeadingName;
};

const HeadingText = ({ children, headingType }: HeadingTextProps): React.JSX.Element => {
	switch (headingType) {
		case 'heading1':
			return <div css={heading1Style}>{children}</div>;
		case 'heading2':
			return <div css={heading2Style}>{children}</div>;
		case 'heading3':
			return <div css={heading3Style}>{children}</div>;
		case 'heading4':
			return <div css={heading4Style}>{children}</div>;
		case 'heading5':
			return <div css={heading5Style}>{children}</div>;
		case 'heading6':
			return <div css={heading6Style}>{children}</div>;
		case 'normal':
		default:
			return <div css={normalStyle}>{children}</div>;
	}
};

const headingSizeStylesMap = cssMap({
	normal: {
		font: token('font.body'),
	},
	heading1: {
		font: token('font.heading.xlarge'),
	},
	heading2: {
		font: token('font.heading.large'),
	},
	heading3: {
		font: token('font.heading.medium'),
	},
	heading4: {
		font: token('font.heading.small'),
	},
	heading5: {
		font: token('font.heading.xsmall'),
	},
	heading6: {
		font: token('font.heading.xxsmall'),
	},
});

const shortcuts: Record<HeadingName, Keymap> = {
	normal: setNormalText,
	heading1: toggleHeading1,
	heading2: toggleHeading2,
	heading3: toggleHeading3,
	heading4: toggleHeading4,
	heading5: toggleHeading5,
	heading6: toggleHeading6,
};

export const HeadingButton = ({ blockType, api }: HeadingButtonProps): React.JSX.Element | null => {
	const { formatMessage } = useIntl();
	const currentBlockType = useSharedPluginStateSelector(api, 'blockType.currentBlockType');
	const availableBlockTypesInDropdown = useSharedPluginStateSelector(
		api,
		'blockType.availableBlockTypesInDropdown',
	);

	if (
		!availableBlockTypesInDropdown?.some(
			(availableBlockType) => availableBlockType.name === blockType.name,
		)
	) {
		return null;
	}

	const fromBlockQuote = currentBlockType?.name === 'blockquote';
	const onClick = () => {
		api?.core?.actions.execute(
			api?.blockType?.commands?.setTextLevel(
				blockType.name as TextBlockTypes,
				INPUT_METHOD.TOOLBAR,
				fromBlockQuote,
			),
		);
	};
	const shortcut = formatShortcut(shortcuts[blockType.name as HeadingName]);
	const isSelected = currentBlockType?.name === blockType.name;

	return (
		<ToolbarDropdownItem
			elemBefore={blockType.icon}
			elemAfter={shortcut ? <ToolbarKeyboardShortcutHint shortcut={shortcut} /> : undefined}
			onClick={onClick}
			isSelected={isSelected}
			ariaKeyshortcuts={shortcut}
		>
			{expValEquals('platform_editor_toolbar_aifc_use_editor_typography', 'isEnabled', true) ? (
				<HeadingText headingType={blockType.name as HeadingName}>
					{formatMessage(blockType.title)}
				</HeadingText>
			) : (
				<Box xcss={headingSizeStylesMap[blockType.name as HeadingName]}>
					{formatMessage(blockType.title)}
				</Box>
			)}
		</ToolbarDropdownItem>
	);
};
