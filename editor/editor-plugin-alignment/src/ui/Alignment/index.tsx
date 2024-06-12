/** @jsx jsx */
import { jsx } from '@emotion/react';
import { injectIntl } from 'react-intl-next';
import type { MessageDescriptor, WrappedComponentProps } from 'react-intl-next';

import type { Keymap } from '@atlaskit/editor-common/keymaps';
import { alignCenter, alignLeft, alignRight } from '@atlaskit/editor-common/keymaps';
import { alignmentMessages } from '@atlaskit/editor-common/messages';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import type { AlignmentState } from '../../pm-plugins/types';
import { IconMap } from '../ToolbarAlignment/icon-map';

import AlignmentButton from './AlignmentButton';
import { alignmentWrapper } from './styles';

export interface Props {
	selectedAlignment?: string;
	onClick: (value: AlignmentState) => void;
	className?: string;
}

let alignCenterKeyboardShortcut;
let alignRightKeyboardShortcut;
if (getBooleanFF('platform.editor.text-alignment-keyboard-shortcuts')) {
	alignCenterKeyboardShortcut = alignCenter;
	alignRightKeyboardShortcut = alignRight;
}

const alignmentOptions: Array<{
	title: MessageDescriptor;
	shortcut?: Keymap;
	value: AlignmentState;
}> = [
	{ title: alignmentMessages.alignLeft, shortcut: alignLeft, value: 'start' },
	{
		title: alignmentMessages.alignCenter,
		shortcut: alignCenterKeyboardShortcut,
		value: 'center',
	},
	{
		title: alignmentMessages.alignRight,
		shortcut: alignRightKeyboardShortcut,
		value: 'end',
	},
];

function Alignment({ onClick, selectedAlignment, className, intl }: Props & WrappedComponentProps) {
	return (
		<div
			data-testid="alignment-buttons"
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			css={alignmentWrapper}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={className}
		>
			{alignmentOptions.map((alignment) => {
				const { value, title, shortcut } = alignment;
				const message = intl.formatMessage(title);
				return (
					<AlignmentButton
						content={<IconMap alignment={value} />}
						key={value}
						value={value}
						label={message}
						shortcut={shortcut}
						onClick={onClick}
						isSelected={value === selectedAlignment}
					/>
				);
			})}
		</div>
	);
}

export default injectIntl(Alignment);
