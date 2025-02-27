/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css as cssUnbounded } from '@compiled/react';
import { injectIntl } from 'react-intl-next';
import type { MessageDescriptor, WrappedComponentProps } from 'react-intl-next';

import { css, jsx } from '@atlaskit/css';
import type { Keymap } from '@atlaskit/editor-common/keymaps';
import { alignCenter, alignLeft, alignRight } from '@atlaskit/editor-common/keymaps';
import { alignmentMessages } from '@atlaskit/editor-common/messages';
import { token } from '@atlaskit/tokens';

import type { AlignmentState } from '../../pm-plugins/types';
import { IconMap } from '../ToolbarAlignment/icon-map';

import AlignmentButton from './AlignmentButton';

const alignmentWrapper = css({
	display: 'flex',
	paddingTop: token('space.0', '0px'),
	paddingBottom: token('space.0', '0px'),
	paddingLeft: token('space.100', '8px'),
	paddingRight: token('space.100', '8px'),
	maxWidth: `${3 * 32 + 2 * 2}px`, // 3 buttons * 32px + 2 * 2px gap
	columnGap: token('space.025'), // add gap between buttons, so they don't crunch each other
});

// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- This rule thinks this isn't a `css()` call due to the name mapping
const alignmentWrapperStylesUnbounded = cssUnbounded({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when an item has been selected
		},
	},
});

export interface Props {
	selectedAlignment?: string;
	onClick: (value: AlignmentState) => void;
	className?: string;
}

const alignCenterKeyboardShortcut = alignCenter;
const alignRightKeyboardShortcut = alignRight;

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
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[alignmentWrapper, alignmentWrapperStylesUnbounded]}
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
