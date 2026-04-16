import React from 'react';
import {
	withAnalyticsEvents,
	type WithAnalyticsEventsProps,
	withAnalyticsContext,
	type WithContextProps,
} from '@atlaskit/analytics-next';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { IntlProvider as ReactIntlNextProvider } from 'react-intl';
import { defaultAnalyticsAttributes } from '../analytics';
import { type Help as HelpInterface } from '../model/Help';

import { HeaderContextProvider } from './contexts/headerContext';
import { HomeContextProvider } from './contexts/homeContext';
import { HelpArticleContextProvider } from './contexts/helpArticleContext';
import { NavigationContextProvider } from './contexts/navigationContext';
import { RelatedArticlesContextProvider } from './contexts/relatedArticlesContext';
import { SearchContextProvider } from './contexts/searchContext';
import { WhatsNewArticleProvider } from './contexts/whatsNewArticleContext';
import { AiContextProvider } from './contexts/aiAgentContext';

import HelpContent from './HelpContent';

export type Props = HelpInterface & WithAnalyticsEventsProps;

const LocaleIntlProvider = ({
	locale = 'en',
	children,
}: {
	children: React.ReactNode;
	locale?: string;
}) => (
	<ReactIntlProvider key={`v6-${locale}`} locale={locale}>
		<ReactIntlNextProvider key={`v5-${locale}`} locale={locale}>
			{children}
		</ReactIntlNextProvider>
	</ReactIntlProvider>
);

export class Help extends React.PureComponent<Props> {
	render(): React.JSX.Element {
		const { children, footer, ...rest } = this.props;
		return (
			<LocaleIntlProvider>
				<HeaderContextProvider {...rest.header}>
					<HomeContextProvider {...rest.home} homeContent={children}>
						<HelpArticleContextProvider {...rest.helpArticle}>
							<RelatedArticlesContextProvider {...rest.relatedArticles}>
								<SearchContextProvider {...rest.search}>
									<WhatsNewArticleProvider {...rest.whatsNew}>
										<AiContextProvider {...rest.ai}>
											<NavigationContextProvider {...rest.navigation}>
												<HelpContent footer={footer} />
											</NavigationContextProvider>
										</AiContextProvider>
									</WhatsNewArticleProvider>
								</SearchContextProvider>
							</RelatedArticlesContextProvider>
						</HelpArticleContextProvider>
					</HomeContextProvider>
				</HeaderContextProvider>
			</LocaleIntlProvider>
		);
	}
}

const _default_1: React.ForwardRefExoticComponent<
	Omit<
		Omit<HelpInterface, keyof WithAnalyticsEventsProps> &
			React.RefAttributes<any> &
			WithContextProps,
		'ref'
	> &
		React.RefAttributes<any>
> = withAnalyticsContext(defaultAnalyticsAttributes)(withAnalyticsEvents()(Help));
export default _default_1;
