/** @jsx jsx */
import { jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { FormattedMessage, injectIntl } from 'react-intl-next';

import { helpDialogMessages as messages } from '@atlaskit/editor-common/messages';
import { ToolbarButton } from '@atlaskit/editor-common/ui-menu';
import CrossIcon from '@atlaskit/icon/glyph/cross';
import type { OnCloseHandler } from '@atlaskit/modal-dialog';

import { dialogHeader, header, toolbarButton } from './styles';

interface ModalHeaderProps extends WrappedComponentProps {
	onClose: OnCloseHandler | undefined;
}

const ModalHeader = injectIntl(({ intl: { formatMessage }, onClose }: ModalHeaderProps) => {
	return (
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
		<div css={header}>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
			<h1 css={dialogHeader}>
				<FormattedMessage {...messages.editorHelp} />
			</h1>

			<div>
				<ToolbarButton
					// @ts-expect-error modal onClose handler requires second parameter of UIAnalyticsEvent, which we don't want to pass
					onClick={onClose}
					title={formatMessage(messages.closeHelpDialog)}
					spacing="compact"
					iconBefore={<CrossIcon label={formatMessage(messages.closeHelpDialog)} size="medium" />}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
					css={toolbarButton}
				/>
			</div>
		</div>
	);
});

export default ModalHeader;
