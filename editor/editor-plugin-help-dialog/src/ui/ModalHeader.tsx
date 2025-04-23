/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage, injectIntl } from 'react-intl-next';

import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import Heading from '@atlaskit/heading';
import CloseIcon from '@atlaskit/icon/core/migration/close--cross';
import type { OnCloseHandler } from '@atlaskit/modal-dialog';

import { header, toolbarButton } from './styles';

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
			<div>
				<ToolbarButton
					// @ts-expect-error modal onClose handler requires second parameter of UIAnalyticsEvent, which we don't want to pass
					onClick={onClose}
					title={formatMessage(messages.closeHelpDialog)}
					spacing="compact"
					iconBefore={
						<CloseIcon
							label={formatMessage(messages.closeHelpDialog)}
							color="currentColor"
							spacing="spacious"
						/>
					}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/no-unsafe-style-overrides -- Ignored via go/DSP-18766
					css={toolbarButton}
				/>
			</div>
		</div>
	);
});

export default ModalHeader;
