import React from 'react';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl-next';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { messages } from '../../messages';
import { type HelpPanelHeader } from '../../model/HelpLayout';

import CloseButton from './CloseButton';
import BackButton from './BackButton';
import { HeaderContainer, HeaderTitle, HeaderContent } from './styled';

export const HelpContent: React.FC<HelpPanelHeader & WrappedComponentProps> = ({
	headerTitle,
	headerContent,
	isBackbuttonVisible = false,
	onCloseButtonClick,
	onBackButtonClick,
	intl: { formatMessage },
}) => {
	const handleOnBackButtonClick = (
		event: React.MouseEvent<HTMLElement, MouseEvent>,
		analyticsEvent: UIAnalyticsEvent,
	): void => {
		if (onBackButtonClick) {
			onBackButtonClick(event, analyticsEvent);
		}
	};

	return (
		<HeaderContainer>
			<BackButton onClick={handleOnBackButtonClick} isVisible={isBackbuttonVisible} />

			<HeaderTitle>
				{headerTitle ? headerTitle : formatMessage(messages.help_panel_header_title)}
			</HeaderTitle>

			{onCloseButtonClick && <CloseButton onClick={onCloseButtonClick} />}
			{headerContent && <HeaderContent>{headerContent}</HeaderContent>}
		</HeaderContainer>
	);
};

const _default_1: React.FC<WithIntlProps<HelpPanelHeader & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<HelpPanelHeader & WrappedComponentProps>;
} = injectIntl(HelpContent);
export default _default_1;
