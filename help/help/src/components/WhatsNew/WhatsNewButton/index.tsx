import React, { useCallback } from 'react';
import { type UIAnalyticsEvent, AnalyticsContext } from '@atlaskit/analytics-next';
import * as colors from '@atlaskit/theme/colors';
import LightbulbIcon from '@atlaskit/icon/core/lightbulb';
import { token } from '@atlaskit/tokens';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl-next';

import { useWhatsNewArticleContext } from '../../contexts/whatsNewArticleContext';
import { useNavigationContext } from '../../contexts/navigationContext';
import { messages } from '../../../messages';
import HelpContentButton from '../../HelpContentButton';
import { ARTICLE_TYPE } from '../../../model/Help';

const ANALYTICS_CONTEXT_DATA = {
	componentName: 'WhatsNewButton',
	packageName: process.env._PACKAGE_NAME_,
	packageVersion: process.env._PACKAGE_VERSION_,
};

interface WhatsNewButtonProps {
	productName?: string;
}

export const WhatsNewButton: React.FC<WrappedComponentProps & WhatsNewButtonProps> = ({
	productName,
	intl: { formatMessage },
}) => {
	const { onWhatsNewButtonClick, whatsNewGetNotificationProvider } = useWhatsNewArticleContext();
	const { openArticle } = useNavigationContext();

	const handleOnButtonClick = useCallback(
		(
			id: string,
			analytics: UIAnalyticsEvent,
			event: React.MouseEvent<HTMLElement, MouseEvent>,
		): void => {
			if (onWhatsNewButtonClick) {
				onWhatsNewButtonClick(event, analytics);
			}

			openArticle({ id: '', type: ARTICLE_TYPE.WHATS_NEW });
		},
		[onWhatsNewButtonClick, openArticle],
	);

	return (
		<HelpContentButton
			id="whats-new"
			key="whats-new"
			tooltipText={formatMessage(messages.help_whats_new_button_tooltip)}
			notificationLogProvider={whatsNewGetNotificationProvider}
			onClick={handleOnButtonClick}
			text={
				productName
					? formatMessage(messages.help_whats_new_button_label, {
							productName,
						})
					: formatMessage(messages.help_whats_new_button_label_without_product_name)
			}
			icon={
				<LightbulbIcon
					color={token('color.icon.subtle', colors.N600)}
					LEGACY_size="medium"
					spacing="spacious"
					label=""
				/>
			}
		/>
	);
};

const WhatsNewButtonWithContext: React.FC<WrappedComponentProps & WhatsNewButtonProps> = (
	props,
) => {
	return (
		<AnalyticsContext data={ANALYTICS_CONTEXT_DATA}>
			<WhatsNewButton {...props} />
		</AnalyticsContext>
	);
};

const _default_1: React.FC<WithIntlProps<WrappedComponentProps & WhatsNewButtonProps>> & {
	WrappedComponent: React.ComponentType<WrappedComponentProps & WhatsNewButtonProps>;
} = injectIntl(WhatsNewButtonWithContext);
export default _default_1;
