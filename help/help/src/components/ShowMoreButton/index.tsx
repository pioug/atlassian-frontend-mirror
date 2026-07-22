import React from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Spinner from '@atlaskit/spinner';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl';
import Button from '@atlaskit/button';

import { messages } from '../../messages';

import { ToggleShowMoreArticlesContainer } from '../ArticlesList/styled';

export type ItemsType = 'articles' | 'changes';

export interface Props {
	itemsType?: ItemsType;
	loading?: boolean;
	maxItemsToDisplay: number;
	minItemsToDisplay: number;
	onToggle: (event: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => void;
	showMoreToggeled: boolean;
}

export const ShowMoreButton: React.FC<Props & WrappedComponentProps> = ({
	showMoreToggeled,
	onToggle,
	minItemsToDisplay,
	maxItemsToDisplay,
	itemsType = 'articles',
	loading = false,
	intl: { formatMessage },
}) => {
	const numberOfItemsLeft =
		maxItemsToDisplay > minItemsToDisplay ? maxItemsToDisplay - minItemsToDisplay : 0;
	const labelMoreMessage =
		itemsType === 'changes'
			? messages.help_show_more_button_label_more_changes
			: messages.help_show_more_button_label_more_articles;

	return showMoreToggeled ? (
		<ToggleShowMoreArticlesContainer>
			<Button appearance="link" spacing="compact" onClick={onToggle}>
				{formatMessage(labelMoreMessage, { numberOfItemsLeft })}
				{loading && (
					<span>
						{' '}
						<Spinner size="medium" />
					</span>
				)}
			</Button>
		</ToggleShowMoreArticlesContainer>
	) : (
		<ToggleShowMoreArticlesContainer>
			<Button appearance="link" spacing="compact" onClick={onToggle}>
				{formatMessage(messages.help_show_more_button_label_less)}
			</Button>
		</ToggleShowMoreArticlesContainer>
	);
};

const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(ShowMoreButton);
export default _default_1;
