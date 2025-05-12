import React, { useCallback, useEffect, useState } from 'react';
import HelpLayout from '@atlaskit/help-layout';

import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';

import { HIDE_CONTENT_DELAY } from './constants';
import { useNavigationContext } from './contexts/navigationContext';
import { useHomeContext } from './contexts/homeContext';
import { useHeaderContext } from './contexts/headerContext';
import { useSearchContext } from './contexts/searchContext';
import { useAiContext } from './contexts/aiAgentContext';
import { useWhatsNewArticleContext } from './contexts/whatsNewArticleContext';
import SearchInput from './Search/SearchInput';
import SearchResults from './Search/SearchResults';
import ArticleComponent from './Article';
import WhatsNewButton from './WhatsNew/WhatsNewButton';
import WhatsNewResults from './WhatsNew/WhatsNewResults';
import HelpContentButton from './HelpContentButton';
import BackButton from './BackButton';
import { NeedMoreHelp } from './NeedMoreHelp';
import type { Props as HelpContentButtonProps } from './HelpContentButton';
import { HelpBodyContainer, HelpBody, Home, HomeAi, HelpBodyAi, StyledUl } from './styled';
import { HelpFooter } from './styled';
import { Tabs } from './Tabs';
import AiChatIcon from '@atlaskit/icon/core/ai-chat';
import SearchIcon from '@atlaskit/icon/core/search';
import { injectIntl, type WrappedComponentProps } from 'react-intl-next';
import { messages } from '../messages';

interface HelpContentInterface {
	footer?: React.ReactNode;
}

export const HelpContent: React.FC<HelpContentInterface & WrappedComponentProps> = ({
	footer,
	intl: { formatMessage },
}) => {
	// TODO: this will enable all the features and refactors related to AI
	const { isAiEnabled } = useAiContext();
	const { homeContent, homeOptions } = useHomeContext();
	const { onSearchWhatsNewArticles, onGetWhatsNewArticle, productName } =
		useWhatsNewArticleContext();
	const { isOverlayVisible, navigateBack, canNavigateBack, onClose } = useNavigationContext();
	const { onSearch } = useSearchContext();
	const { onBackButtonClick } = useHeaderContext();

	const [isOverlayFullyVisible, setIsOverlayFullyVisible] = useState(isOverlayVisible);

	const handleOnBackButtonClick = useCallback(
		(event: React.MouseEvent<HTMLElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent): void => {
			if (onBackButtonClick) {
				onBackButtonClick(event, analyticsEvent);
			}
			if (navigateBack) {
				navigateBack();
			}
		},
		[navigateBack, onBackButtonClick],
	);

	useEffect(() => {
		let handler: ReturnType<typeof setTimeout>;
		if (isOverlayVisible && !isAiEnabled) {
			handler = setTimeout(() => {
				setIsOverlayFullyVisible(isOverlayVisible);
			}, HIDE_CONTENT_DELAY);
		} else {
			setIsOverlayFullyVisible(isOverlayVisible);
		}

		return () => {
			if (handler) {
				clearTimeout(handler);
			}
		};
	}, [isOverlayVisible, isAiEnabled]);

	// Values for tabs
	const [activeTab, setActiveTab] = useState(0);
	const handleTabClick = (index: number) => {
		setActiveTab(index);
		// add custom event here via props
	};
	const tabs = [
		{
			label: formatMessage(messages.help_ai_tab),
			icon: <AiChatIcon label={formatMessage(messages.help_ai_tab)} />,
		},
		{
			label: formatMessage(messages.help_search_tab),
			icon: <SearchIcon label={formatMessage(messages.help_search_tab)} />,
		},
	];

	const handleNeedMoreHelpClick = useCallback(() => {
		setActiveTab(0);
	}, []);

	const HelpLayoutWithAi = (
		<HelpLayout onCloseButtonClick={onClose} isAiEnabled={isAiEnabled}>
			<Tabs activeTab={activeTab} onTabClick={handleTabClick} tabs={tabs} />

			{activeTab === 0 && <div>ai agent here</div>}
			{activeTab === 1 && (
				<>
					<HelpBodyContainer>
						<HelpBodyAi>
							<BackButton onClick={handleOnBackButtonClick} isVisible={canNavigateBack} />
							{onSearch && <SearchInput isAiEnabled={true} />}
							<SearchResults isAiEnabled={true} />
							<ArticleComponent isAiEnabled={true} />
							<HomeAi
								isOverlayFullyVisible={isOverlayFullyVisible}
								isOverlayVisible={isOverlayVisible}
							>
								{homeContent}
								<StyledUl>
									{onSearchWhatsNewArticles && onGetWhatsNewArticle && (
										<WhatsNewButton productName={productName} />
									)}
									{homeOptions &&
										homeOptions.map((defaultOption: HelpContentButtonProps) => {
											return <HelpContentButton key={defaultOption.id} {...defaultOption} />;
										})}
								</StyledUl>
							</HomeAi>
						</HelpBodyAi>
						<WhatsNewResults />
					</HelpBodyContainer>
					<NeedMoreHelp
						label={formatMessage(messages.help_need_more_help_label)}
						onNeedMoreHelpClick={handleNeedMoreHelpClick}
					/>
					{footer && <HelpFooter data-testid="inside-footer">{footer}</HelpFooter>}
				</>
			)}
		</HelpLayout>
	);

	const HelpLayoutWithoutAi = (
		<HelpLayout
			onBackButtonClick={handleOnBackButtonClick}
			onCloseButtonClick={onClose}
			isBackbuttonVisible={canNavigateBack}
			footer={footer}
			headerContent={onSearch && <SearchInput />}
		>
			<HelpBodyContainer>
				<HelpBody>
					<SearchResults />
					<ArticleComponent />
					<Home isOverlayFullyVisible={isOverlayFullyVisible} isOverlayVisible={isOverlayVisible}>
						{homeContent}
						<StyledUl>
							{onSearchWhatsNewArticles && onGetWhatsNewArticle && (
								<WhatsNewButton productName={productName} />
							)}
							{homeOptions &&
								homeOptions.map((defaultOption: HelpContentButtonProps) => {
									return <HelpContentButton key={defaultOption.id} {...defaultOption} />;
								})}
						</StyledUl>
					</Home>
				</HelpBody>
				<WhatsNewResults />
			</HelpBodyContainer>
		</HelpLayout>
	);

	return isAiEnabled ? HelpLayoutWithAi : HelpLayoutWithoutAi;
};

export default injectIntl(HelpContent);
