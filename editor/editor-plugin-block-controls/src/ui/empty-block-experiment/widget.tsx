import React, { createElement } from 'react';

import ReactDOM from 'react-dom';
import {
	injectIntl,
	type IntlShape,
	RawIntlProvider,
	type WrappedComponentProps,
} from 'react-intl-next';

import { ToolTipContent } from '@atlaskit/editor-common/keymaps';
import { blockControlsMessages as messages } from '@atlaskit/editor-common/messages';
import { type ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { ZERO_WIDTH_SPACE } from '@atlaskit/editor-common/whitespace';
import { type Selection, TextSelection } from '@atlaskit/editor-prosemirror/state';
import { Decoration } from '@atlaskit/editor-prosemirror/view';
import EditorAddIcon from '@atlaskit/icon/glyph/editor/add';
import { Box, Pressable, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { type BlockControlsPlugin } from '../../types';

const wrapperStyles = xcss({
	position: 'absolute',
	top: `calc('50%' - ${token('space.150')})`,
	left: `calc(${token('space.negative.300')} + ${token('space.negative.100')})`,
});

const buttonStyles = xcss({
	boxSizing: 'border-box',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
	height: token('space.300'),
	width: token('space.300'),
	border: 'none',
	backgroundColor: 'color.background.neutral',
	borderRadius: '50%',
	color: 'color.text.accent.gray',
	zIndex: 'card',
	outline: 'none',

	':hover': {
		backgroundColor: 'color.background.neutral.hovered',
	},

	':active': {
		backgroundColor: 'color.background.neutral.pressed',
	},

	':focus': {
		outline: `2px solid ${token('color.border.focused', '#388BFF')}`,
	},
});

type Props = {
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined;
	getPos: () => number | undefined;
};

export const TypeAheadControl = ({
	api,
	getPos,
	intl: { formatMessage },
}: Props & WrappedComponentProps) => {
	return (
		<Box xcss={[wrapperStyles]}>
			<Tooltip
				content={
					<ToolTipContent description={formatMessage(messages.insert)} shortcutOverride="/" />
				}
			>
				<Pressable
					type="button"
					aria-label={formatMessage(messages.insert)}
					xcss={[buttonStyles]}
					onClick={() => {
						api?.core?.actions.execute(({ tr }) => {
							const start = getPos();
							if (!start) {
								return null;
							}
							return tr.setSelection(TextSelection.create(tr.doc, start));
						});
						api?.quickInsert?.actions.openTypeAhead('blockControl');
					}}
				>
					<EditorAddIcon label="add" size="medium" />
				</Pressable>
			</Tooltip>
		</Box>
	);
};

const TypeAheadControlWithIntl = injectIntl(TypeAheadControl);

const toDOM = (
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	getPos: () => number | undefined,
	getIntl: () => IntlShape,
) => {
	const element = document.createElement('span');
	element.contentEditable = 'false';
	element.setAttribute('style', 'position: relative');
	element.setAttribute('class', 'empty-block-experiment');
	element.setAttribute('data-empty-block-experiment', 'true');

	ReactDOM.render(
		createElement(
			RawIntlProvider,
			{ value: getIntl() },
			createElement(TypeAheadControlWithIntl, {
				api,
				getPos,
			}),
		),
		element,
	);

	// // This is a hack to ensure that the cursor in Chrome does not take on the height of the widget button.
	// // Cursor height cannot be controlled via CSS and is handled by the browser.
	// // see Prosemirror forum: https://discuss.prosemirror.net/t/chrome-caret-cursor-larger-than-the-text-with-inlined-items/5946
	const cursorHack = document.createTextNode(ZERO_WIDTH_SPACE);
	element.appendChild(cursorHack);

	return element;
};

export const createEmptyBlockWidgetDecoration = (
	selection: Selection,
	api: ExtractInjectionAPI<BlockControlsPlugin> | undefined,
	getIntl: () => IntlShape,
) => {
	if (selection instanceof TextSelection && selection.$cursor) {
		const { $cursor } = selection;
		const { depth } = $cursor;

		const cursorAtRoot = depth === 1;
		const nodeIsEmpty = $cursor.parent?.nodeSize === 2;

		const supportedNodeTypes = ['paragraph', 'heading'];

		if (cursorAtRoot && nodeIsEmpty && supportedNodeTypes.includes($cursor.parent?.type.name)) {
			return Decoration.widget(
				selection.$cursor.posAtIndex($cursor.depth - 1),
				(_view, getPos) => toDOM(api, getPos, getIntl),
				{
					key: 'emptyBlockWidgetDecoration',
					side: -1,
				},
			);
		}
	}
};
