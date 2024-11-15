import React from 'react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import {
	useAnalyticsEvents,
	type UIAnalyticsEvent,
	AnalyticsContext,
} from '@atlaskit/analytics-next';
import Tooltip from '@atlaskit/tooltip';
import Button from '@atlaskit/button/standard-button';
import EditorCloseIcon from '@atlaskit/icon/core/migration/close--editor-close';

import { messages } from '../../messages';

import { CloseButtonContainer } from './styled';

interface Props {
	// Function executed when the user clicks the close button
	onClick(
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent?: UIAnalyticsEvent,
	): void;
}

/**
 * This function will return a CloseButton component only if the function
 * to be executed on the onClick event is passed as a parameter
 *
 * @param onClick - Function executed when the close btn is clicked
 */
export const CloseButton: React.FC<Props & WrappedComponentProps> = ({
	onClick,
	intl: { formatMessage },
}) => {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	const handleOnClick = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
		if (onClick) {
			const analyticsEvent: UIAnalyticsEvent = createAnalyticsEvent({
				action: 'clicked',
			});
			onClick(event, analyticsEvent);
		}
	};

	return (
		<CloseButtonContainer>
			<Tooltip content={formatMessage(messages.help_panel_header_close)} position="left">
				<Button
					onClick={handleOnClick}
					appearance="subtle"
					aria-label={formatMessage(messages.help_panel_header_close_button)}
					iconBefore={
						<EditorCloseIcon
							color="currentColor"
							label={formatMessage(messages.help_panel_header_close)}
							LEGACY_size="medium"
						/>
					}
				/>
			</Tooltip>
		</CloseButtonContainer>
	);
};

const CloseButtonWithContext: React.FC<Props & WrappedComponentProps> = (props) => {
	return (
		<AnalyticsContext
			data={{
				componentName: 'closeButton',
				packageName: process.env._PACKAGE_NAME_,
				packageVersion: process.env._PACKAGE_VERSION_,
			}}
		>
			<CloseButton {...props} />
		</AnalyticsContext>
	);
};

export default injectIntl(CloseButtonWithContext);
