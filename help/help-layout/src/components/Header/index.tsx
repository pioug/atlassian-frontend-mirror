import React from 'react';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { messages } from '../../messages';
import { type HelpPanelHeader } from '../../model/HelpLayout';

import CloseButton from './CloseButton';
import BackButton from './BackButton';
import { HeaderContainer, HeaderTitle, HeaderContent, HeaderTitleAi } from './styled';

export const HelpContent: React.FC<HelpPanelHeader & WrappedComponentProps> = ({
	headerTitle,
	headerContent,
	isBackbuttonVisible = false,
	onCloseButtonClick,
	onBackButtonClick,
	isAiEnabled,
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
			{isAiEnabled ? (
				<HeaderTitleAi>
					{headerTitle ? headerTitle : formatMessage(messages.help_panel_header_title)}
				</HeaderTitleAi>
			) : (
				<HeaderTitle>
					{headerTitle ? headerTitle : formatMessage(messages.help_panel_header_title)}
				</HeaderTitle>
			)}
			{onCloseButtonClick && <CloseButton onClick={onCloseButtonClick} isAiEnabled={isAiEnabled} />}
			{headerContent && <HeaderContent>{headerContent}</HeaderContent>}
		</HeaderContainer>
	);
};

export default injectIntl(HelpContent);
