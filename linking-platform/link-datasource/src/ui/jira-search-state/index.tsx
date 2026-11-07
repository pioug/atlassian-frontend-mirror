import React from 'react';

import { defineMessages, useIntl } from 'react-intl';

import { cssMap, cx } from '@atlaskit/css';
import type MediaReducedMotion from '@atlaskit/css/at-rules/media-reduced-motion';
import Heading from '@atlaskit/heading/heading';
import IntlMessagesProvider from '@atlaskit/intl-messages-provider/main';
import { Box } from '@atlaskit/primitives/compiled/box';
import { Flex } from '@atlaskit/primitives/compiled/flex';
import { Text } from '@atlaskit/primitives/compiled/text';
import { token } from '@atlaskit/tokens';
import VisuallyHidden from '@atlaskit/visually-hidden/visually-hidden';

import { RichIconSearch } from '../../common/ui/rich-icon/search';
import { SpotSearchNoResult } from '../../common/ui/spot/error-state/search-no-result';
import { fetchMessagesForLocale } from '../../common/utils/locale/fetch-messages-for-locale';
import i18nEN from '../../i18n/en';
import { loadingErrorMessages } from '../common/error-state/messages';
import { initialStateViewMessages } from '../common/initial-state-view/messages';
import EmptyState from '../issue-like-table/empty-state';

const messages = defineMessages({
	loading: {
		id: 'link-datasource.jira-search-state.loading',
		defaultMessage: 'Searching for work items…',
		description: 'Loading label while an embedded Jira work-item search is running.',
	},
});

const styles = cssMap({
	loading: {
		height: '100%',
		overflow: 'hidden',
	},
	canvas: {
		minHeight: '281px',
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
	compactCanvas: {
		minHeight: '224px',
	},
	resolvedEmpty: {
		animationName: token('motion.keyframe.fade.in'),
		animationDuration: token('motion.duration.short'),
		animationTimingFunction: token('motion.easing.out.practical'),
		['@media (prefers-reduced-motion: reduce)' satisfies MediaReducedMotion]: {
			animationName: 'none',
		},
	},
	content: {
		maxWidth: '360px',
		textAlign: 'center',
	},
});

type Props = {
	/** Smaller illustrations and spacing for an embedded recovery card. */
	isCompact?: boolean;
	variant: 'initial' | 'empty' | 'loading';
};

const SearchState = ({ variant, isCompact = false }: Props): React.JSX.Element => {
	const { formatMessage } = useIntl();
	const isEmpty = variant === 'empty';
	if (variant === 'loading') {
		return (
			<Box xcss={styles.loading} testId="jira-search-state-loading">
				<VisuallyHidden>{formatMessage(messages.loading)}</VisuallyHidden>
				<div aria-hidden="true">
					<EmptyState isCompact testId="jira-search-table-skeleton" />
				</div>
			</Box>
		);
	}
	return (
		<Flex
			direction="column"
			alignItems="center"
			justifyContent="center"
			gap={isCompact ? 'space.100' : 'space.200'}
			xcss={cx(styles.canvas, isCompact && styles.compactCanvas, isEmpty && styles.resolvedEmpty)}
			testId={`jira-search-state-${variant}`}
		>
			{isEmpty ? (
				<SpotSearchNoResult size={isCompact ? 'large' : 'xlarge'} alt="" />
			) : (
				<RichIconSearch size={isCompact ? 'large' : 'xlarge'} alt="" />
			)}
			<Box xcss={styles.content}>
				<Heading as="h3" size="small">
					{formatMessage(
						isEmpty
							? loadingErrorMessages.noResultsFound
							: initialStateViewMessages.jiraSearchTitle,
					)}
				</Heading>
			</Box>
			<Box xcss={styles.content}>
				<Text color="color.text.subtle">
					{formatMessage(
						isEmpty
							? loadingErrorMessages.noResultsFoundDescription
							: initialStateViewMessages.searchDescriptionForBasicSearchSllv,
					)}
				</Text>
			</Box>
		</Flex>
	);
};

/** Reuses the work-item picker's illustrations and copy without emitting datasource analytics. */
export const JiraSearchState = (props: Props): React.JSX.Element => (
	<IntlMessagesProvider defaultMessages={i18nEN} loaderFn={fetchMessagesForLocale}>
		<SearchState {...props} />
	</IntlMessagesProvider>
);
