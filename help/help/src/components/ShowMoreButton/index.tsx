import React from 'react';
import { type UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Spinner from '@atlaskit/spinner';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl-next';
import Button from '@atlaskit/button';

import { messages } from '../../messages';

import { ToggleShowMoreArticlesContainer } from '../ArticlesList/styled';

export interface Props {
	itemsType?: string;
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
	itemsType,
	loading = false,
	intl: { formatMessage },
}) =>
	showMoreToggeled ? (
		<ToggleShowMoreArticlesContainer>
			<Button appearance="link" spacing="compact" onClick={onToggle}>
				{formatMessage(messages.help_show_more_button_label_more, {
					numberOfItemsLeft:
						maxItemsToDisplay > minItemsToDisplay ? maxItemsToDisplay - minItemsToDisplay : 0,

					itemsType: itemsType,
				})}
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

const _default_1: React.FC<WithIntlProps<Props & WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<Props & WrappedComponentProps>;
} = injectIntl(ShowMoreButton);
export default _default_1;
