/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css, type SerializedStyles } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage, injectIntl } from 'react-intl-next';

import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import Heading from '@atlaskit/heading';
import CrossIcon from '@atlaskit/icon/core/migration/cross';
import { CloseButton, type OnCloseHandler } from '@atlaskit/modal-dialog';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';

import { header, toolbarButton } from './styles';

const toolbarFocusStyles: SerializedStyles = css({
	// In Firefox/Safari, when user clicks (as suppose to press Enter) on the help quick insert item, focus ring may not be present
	// Hence we manually force it
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors
	'button:focus:not(:focus-visible)': {
		outline: `2px solid ${token('color.border.focused')}`,
		outlineOffset: token('space.025', '2px'),
	},
});

interface ModalHeaderProps extends WrappedComponentProps {
	onClose: OnCloseHandler | undefined;
}

const ModalHeader = injectIntl(({ intl: { formatMessage }, onClose }: ModalHeaderProps) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={header}>
			<Heading size="large">
				<FormattedMessage
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...messages.editorHelp}
				/>
			</Heading>

			{onClose && fg('platform_editor_update_modal_close_button') ? (
				<div css={toolbarFocusStyles}>
					<Tooltip content={formatMessage(messages.closeHelpDialog)} position="top">
						<CloseButton onClick={onClose} label={formatMessage(messages.closeHelpDialog)} />
					</Tooltip>
				</div>
			) : (
				<div>
					<ToolbarButton
						// @ts-expect-error modal onClose handler requires second parameter of UIAnalyticsEvent, which we don't want to pass
						onClick={onClose}
						title={formatMessage(messages.closeHelpDialog)}
						spacing="compact"
						iconBefore={
							<CrossIcon
								label={formatMessage(messages.closeHelpDialog)}
								color="currentColor"
								spacing="spacious"
							/>
						}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
						css={toolbarButton}
					/>
				</div>
			)}
		</div>
	);
});

export default ModalHeader;
