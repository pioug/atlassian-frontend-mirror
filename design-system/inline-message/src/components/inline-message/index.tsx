/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type CSSProperties, type FC, type ReactNode, useCallback, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import Button from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import { Inline, Text } from '@atlaskit/primitives';
import { B300, G200, P200, R300, Y200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { IconAppearance, InlineDialogPlacement } from '../../types';
import MessageIcon from '../message-icon';

interface InlineMessageProps {
	/**
	 * The elements to be displayed by the inline dialog.
	 */
	children?: ReactNode;
	/**
	 * The placement to be passed to the inline dialog. Determines where around
	 * the text the dialog is displayed.
	 */
	placement?: InlineDialogPlacement;
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
	 * @deprecated {@link https://hello.atlassian.net/browse/ENGHEALTH-162 Internal documentation for deprecation (no external access)} Please avoid using this prop as we intend to remove the prop completely in a future release. See DSP-5207 for more information.
	 * Instead use the 'appearance' prop.
	 * Set the icon to be used before the title.
	 */
	type?: IconAppearance;
	/**
	 * A unique string that appears as a data attribute, `data-testid`,
	 * in the rendered code. It is provided to serve as a hook for automated tests.
	 *
	 * The value of `testId` is attached to the different sub-components in Inline Message:
	 *  - `testId`: the top-level inline message component
	 *  - `testId--inline-dialog`: the content of the message
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

const rootStyles = css({
	display: 'inline-block',
	maxWidth: '100%',
	'&:focus': {
		outline: '1px solid',
	},
	'&:hover': {
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'[data-ds--inline-message--icon]': {
			// Legacy style
			color: 'var(--icon-accent-color)',
		},
		// eslint-disable-next-line @atlaskit/design-system/no-nested-styles, @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'[data-ds--inline-message--button]': {
			textDecoration: 'underline',
		},
	},
});

const iconColor = (appearance: IconAppearance) => {
	switch (appearance) {
		case 'connectivity':
			return token('color.icon.brand', B300);
		case 'confirmation':
			return token('color.icon.success', G200);
		case 'info':
			return token('color.icon.discovery', P200);
		case 'warning':
			return token('color.icon.warning', Y200);
		case 'error':
			return token('color.icon.danger', R300);
	}
};

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
	type = 'connectivity',
	appearance,
	children,
	testId,
	iconLabel,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleDialog = useCallback(() => {
		setIsOpen((oldState) => !oldState);
	}, [setIsOpen]);

	const onCloseDialog = useCallback(() => setIsOpen(false), [setIsOpen]);

	if (!appearance) {
		appearance = type;
	}

	return (
		<div
			css={rootStyles}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={
				{
					'--icon-accent-color': iconColor(appearance),
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				} as CSSProperties
			}
			data-testid={testId}
		>
			<InlineDialog
				onClose={onCloseDialog}
				content={children}
				isOpen={isOpen}
				placement={placement}
				testId={testId && `${testId}--inline-dialog`}
			>
				<Button
					data-ds--inline-message--button
					appearance="subtle-link"
					onClick={toggleDialog}
					spacing="none"
					testId={testId && `${testId}--button`}
					aria-expanded={isOpen}
				>
					<Inline space="space.050" alignBlock="center">
						<MessageIcon isOpen={isOpen} appearance={appearance} label={iconLabel} />
						<Inline space="space.100">
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
				</Button>
			</InlineDialog>
		</div>
	);
};

export default InlineMessage;
