/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC, type ReactNode, useCallback, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { useId } from '@atlaskit/ds-lib/use-id';
import Popup, { type PopupProps } from '@atlaskit/popup';
import { Box, Inline, Pressable, Text } from '@atlaskit/primitives/compiled';
import { B300, G200, P200, R300, Y200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { IconAppearance, IconSpacing, PopupPlacement } from '../../types';
import MessageIcon from '../message-icon';

interface InlineMessageProps extends Pick<PopupProps, 'fallbackPlacements'> {
	/**
	 * The elements to be displayed by the popup.
	 */
	children?: ReactNode;
	/**
	 * The placement to be passed to the popup. Determines where around
	 * the text the dialog is displayed.
	 */
	placement?: PopupPlacement;
	/**
	 * Text to display second.
	 */
	secondaryText?: ReactNode;
	/**
	 * Text to display first, bolded for emphasis.
	 */
	title?: ReactNode;
	/**
	 * Set the icon to be used before the title. Options are: connectivity,
	 * confirmation, info, warning, and error.
	 */
	appearance?: IconAppearance;
	/**
	 * The spacing of the underlying icon button. Options are: spacious and compact.
	 */
	spacing?: IconSpacing;
	/**
	 * A unique string that appears as a data attribute, `data-testid`,
	 * in the rendered code. It is provided to serve as a hook for automated tests.
	 *
	 * The value of `testId` is attached to the different sub-components in Inline Message:
	 *  - `testId`: the top-level inline message component
	 *  - `testId--popup`: the content of the message
	 *  - `testId--button`: the button element that opens the dialog on press
	 *  - `testId--title`: the title of the message
	 *  - `testId--text`: the text of the message
	 */
	testId?: string;
	/**
	 * Text to be used as the label for the button icon. You must use this to provide information for people who use assistive technology when there is no title and/or secondaryText.
	 */
	iconLabel?: string;
}
const styles = cssMap({
	contentStyles: {
		paddingInlineStart: token('space.300'),
		paddingInlineEnd: token('space.300'),
		paddingBlockStart: token('space.200'),
		paddingBlockEnd: token('space.200'),
	},
	rootStyles: {
		display: 'inline-block',
		maxWidth: '100%',
		'&:focus': {
			outline: `${token('border.width')} solid`,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
		'&:hover [data-ds--inline-message--icon]': {
			// Legacy style
			color: 'var(--icon-accent-color)',
		},
	},
	pressableStyles: {
		display: 'inline-flex',
		backgroundColor: token('color.background.neutral.subtle'),
		color: token('color.text.subtle'),
		whiteSpace: 'nowrap',
		paddingBlock: token('space.0'),
		paddingInline: token('space.0'),
		position: 'relative',
		alignItems: 'baseline',
		maxWidth: '100%',
		height: 'auto',
		width: 'auto',
		verticalAlign: 'baseline',
		font: token('font.body'),
		'&:hover': {
			textDecoration: 'underline',
		},
	},
});

const iconColor = cssMap({
	connectivity: {
		'--icon-accent-color': token('color.icon.brand', B300),
	},
	confirmation: {
		'--icon-accent-color': token('color.icon.success', G200),
	},
	info: {
		'--icon-accent-color': token('color.icon.discovery', P200),
	},
	warning: {
		'--icon-accent-color': token('color.icon.warning', Y200),
	},
	error: {
		'--icon-accent-color': token('color.icon.danger', R300),
	},
});

/**
 * __Inline message__
 *
 * An inline message lets users know when important information is available or when an action is required.
 *
 * - [Examples](https://atlassian.design/components/inline-message/examples)
 * - [Code](https://atlassian.design/components/inline-message/code)
 * - [Usage](https://atlassian.design/components/inline-message/usage)
 *
 * @example
 *
 * ```jsx
 * const Component = () => (
 *   <InlineMessage
 *    title="Inline Message Title Example"
 *    secondaryText="Secondary Text"
 *   >
 *    <p>Some text that would be inside the open dialog and otherwise hidden.</p>
 *   </InlineMessage>
 * );
 * ```
 */
const InlineMessage: FC<InlineMessageProps> = ({
	placement = 'bottom-start',
	secondaryText = '',
	title = '',
	appearance = 'connectivity',
	spacing = 'spacious',
	children,
	testId,
	iconLabel,
	fallbackPlacements,
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const id = useId();

	const toggleDialog = useCallback(() => {
		setIsOpen((oldState) => !oldState);
	}, [setIsOpen]);

	const onCloseDialog = useCallback(() => setIsOpen(false), [setIsOpen]);

	return (
		<div css={[styles.rootStyles, iconColor[appearance]]} data-testid={testId}>
			<Popup
				onClose={onCloseDialog}
				content={() => <Box xcss={styles.contentStyles}>{children}</Box>}
				isOpen={isOpen}
				placement={placement}
				testId={testId && `${testId}--popup`}
				fallbackPlacements={fallbackPlacements}
				shouldRenderToParent={true}
				role="dialog"
				titleId={id}
				shouldDisableFocusLock={true}
				autoFocus={false}
				trigger={({ ref, ...triggerProps }) => (
					<Pressable
						{...triggerProps}
						ref={ref}
						id={id}
						data-ds--inline-message--button
						onClick={toggleDialog}
						testId={testId && `${testId}--button`}
						xcss={styles.pressableStyles}
						aria-expanded={isOpen}
					>
						<Inline as="span" space="space.050" alignBlock="center">
							<MessageIcon
								isOpen={isOpen}
								appearance={appearance}
								label={iconLabel}
								spacing={spacing}
							/>
							<Inline as="span" space="space.100">
								{title && (
									<Text weight="medium" testId={testId && `${testId}--title`}>
										{title}
									</Text>
								)}
								{secondaryText && (
									<Text
										weight="medium"
										color="color.text.subtlest"
										maxLines={1}
										testId={testId && `${testId}--text`}
									>
										{secondaryText}
									</Text>
								)}
							</Inline>
						</Inline>
					</Pressable>
				)}
			/>
		</div>
	);
};

export default InlineMessage;
