/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/** @jsxFrag */

import React, { useCallback, useState, useRef } from 'react';
import { Transition } from 'react-transition-group';
import isEqual from 'lodash/isEqual';
import Select from '@atlaskit/select';
import { injectIntl, type WithIntlProps, type WrappedComponentProps } from 'react-intl-next';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { Label } from '@atlaskit/form';

import { VIEW } from '../../constants';

import { messages } from '../../../messages';
import { WHATS_NEW_ITEM_TYPES } from '../../../model/WhatsNew';
import { REQUEST_STATE } from '../../../model/Requests';

import { type TransitionStatus, NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE } from '../../constants';
import { useWhatsNewArticleContext } from '../../contexts/whatsNewArticleContext';
import { useNavigationContext } from '../../contexts/navigationContext';
import { useAiContext } from '../../contexts/aiAgentContext';

import WhatsNewResultsEmpty from './WhatsNewResultsEmpty';
import WhatsNewResultsError from './WhatsNewResultsError';
import WhatsNewResultsLoading from './WhatsNewResultsLoading';
import WhatsNewResultsList from './WhatsNewResultsList';
import { SelectContainer, WhatsNewResultsListContainer } from './styled';

interface SelectOption {
	label: string;
	value: WHATS_NEW_ITEM_TYPES | undefined | '';
}

const FADEIN_OVERLAY_TRANSITION_DURATION_MS = 440;

const whatsNewResultsContainerStyles = css({
	position: 'absolute',
	height: '100%',
	width: '100%',
	top: 0,
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 1,
	paddingTop: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
	transition: `opacity ${FADEIN_OVERLAY_TRANSITION_DURATION_MS}ms`,
	opacity: 0,
	visibility: 'hidden',
});

const whatsNewResultsContainerAiStyles = css({
	paddingBottom: token('space.200', '16px'),
	paddingLeft: token('space.200', '16px'),
	paddingRight: token('space.200', '16px'),
	position: 'absolute',
	width: '100%',
	top: token('space.800', '60px'),
	backgroundColor: token('elevation.surface', '#FFFFFF'),
	flex: 1,
	flexDirection: 'column',
	boxSizing: 'border-box',
	overflowX: 'hidden',
	overflowY: 'auto',
	zIndex: 1,
});

const transitionStyles: {
	[id: string]: { [index: string]: string | number | null };
} = {
	entering: { opacity: 1, visibility: 'visible' },
	entered: { opacity: 1, visibility: 'visible' },
	exiting: { opacity: 0, visibility: 'visible' },
	exited: { opacity: 0, visibility: 'hidden' },
};

export const WhatsNewResults: React.FC<WrappedComponentProps> = ({ intl: { formatMessage } }) => {
	const { view: helpContextView } = useNavigationContext();
	const { isAiEnabled } = useAiContext();
	const {
		searchWhatsNewArticlesResult,
		onSearchWhatsNewArticles,
		searchWhatsNewArticlesState,
		onWhatsNewResultItemClick,
	} = useWhatsNewArticleContext();
	const containerRef = useRef<HTMLDivElement>(null);
	const containerScrollPosition = useRef<number>(0);

	const SELECT_DEFAULT_VALUE: SelectOption = {
		value: '',
		label: formatMessage(messages.help_whats_new_filter_select_option_all),
	};

	const SELECT_EMPTY_VALUE: SelectOption = {
		value: undefined,
		label: '',
	};

	const [selectedOption, setSelectedOption] = useState<SelectOption>(SELECT_EMPTY_VALUE);

	const handleOnShowMoreButtonClick = useCallback(() => {
		if (searchWhatsNewArticlesResult && onSearchWhatsNewArticles) {
			const { nextPage, hasNextPage } = searchWhatsNewArticlesResult;
			if (nextPage && hasNextPage) {
				onSearchWhatsNewArticles(
					selectedOption.value,
					NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE,
					nextPage,
				);
			}
		}
	}, [onSearchWhatsNewArticles, searchWhatsNewArticlesResult, selectedOption]);

	const handleOnEnter = () => {
		setTimeout(() => {
			if (containerRef.current) {
				containerRef.current.scrollTop = containerScrollPosition.current;
			}
		}, 0);

		if (isEqual(selectedOption, SELECT_EMPTY_VALUE)) {
			setSelectedOption(SELECT_DEFAULT_VALUE);
			onSearchWhatsNewArticles && onSearchWhatsNewArticles();
		}
	};

	const handleOnExit = () => {
		if (helpContextView === VIEW.DEFAULT_CONTENT) {
			setSelectedOption(SELECT_EMPTY_VALUE);
			containerScrollPosition.current = 0;
		} else {
			containerScrollPosition.current = containerRef.current ? containerRef.current.scrollTop : 0;
		}
	};

	const handleOnClearFilter = () => {
		if (onSearchWhatsNewArticles) {
			setSelectedOption({
				value: '',
				label: formatMessage(messages.help_whats_new_filter_select_option_all),
			});
			onSearchWhatsNewArticles('', NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE, '');
		}
	};

	return (
		<Transition
			in={helpContextView === VIEW.WHATS_NEW}
			timeout={FADEIN_OVERLAY_TRANSITION_DURATION_MS}
			onEnter={handleOnEnter}
			onExit={handleOnExit}
		>
			{(state: TransitionStatus) =>
				isAiEnabled ? (
					<div
						ref={containerRef}
						css={whatsNewResultsContainerAiStyles}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							...transitionStyles[state],
						}}
					>
						{searchWhatsNewArticlesState === REQUEST_STATE.loading &&
							searchWhatsNewArticlesResult === null &&
							state !== 'exited' && <WhatsNewResultsLoading />}
						{(searchWhatsNewArticlesState === REQUEST_STATE.done ||
							searchWhatsNewArticlesState === REQUEST_STATE.loading) &&
							searchWhatsNewArticlesResult !== null &&
							state !== 'exited' && (
								<>
									<SelectContainer>
										<Label htmlFor="help_whats_new_filter_select_label">
											{formatMessage(messages.help_whats_new_filter_select_label)}
										</Label>
										<Select
											defaultValue={selectedOption}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
											className="single-select"
											classNamePrefix="react-select"
											inputId="help_whats_new_filter_select_label"
											options={[
												{
													value: '',
													label: formatMessage(messages.help_whats_new_filter_select_option_all),
												},
												{
													value: WHATS_NEW_ITEM_TYPES.NEW_FEATURE,
													label: formatMessage(messages.help_whats_new_filter_select_option_new),
												},
												{
													label: formatMessage(
														messages.help_whats_new_filter_select_option_improvement,
													),
													value: WHATS_NEW_ITEM_TYPES.IMPROVEMENT,
												},
												{
													label: formatMessage(messages.help_whats_new_filter_select_option_fix),
													value: WHATS_NEW_ITEM_TYPES.FIX,
												},
												{
													label: formatMessage(
														messages.help_whats_new_filter_select_option_removed,
													),
													value: WHATS_NEW_ITEM_TYPES.REMOVED,
												},
												{
													label: formatMessage(
														messages.help_whats_new_filter_select_option_experiment,
													),
													value: WHATS_NEW_ITEM_TYPES.EXPERIMENT,
												},
											]}
											value={selectedOption}
											onChange={(option) => {
												if (onSearchWhatsNewArticles) {
													const selectedOptionValue = (
														option as {
															value: string;
														}
													).value as WHATS_NEW_ITEM_TYPES | '';
													const selectedOptionLabel = (
														option as {
															label: string;
														}
													).label as string;
													setSelectedOption({
														value: selectedOptionValue,
														label: selectedOptionLabel,
													});
													onSearchWhatsNewArticles(
														selectedOptionValue,
														NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE,
														'',
													);
												}
											}}
										/>
									</SelectContainer>
									<WhatsNewResultsListContainer>
										{searchWhatsNewArticlesResult.articles.length > 0 ? (
											<WhatsNewResultsList
												whatsNewArticles={searchWhatsNewArticlesResult.articles}
												onWhatsNewResultItemClick={onWhatsNewResultItemClick}
												onShowMoreButtonClick={handleOnShowMoreButtonClick}
												hasNextPage={searchWhatsNewArticlesResult?.hasNextPage}
												nextPage={searchWhatsNewArticlesResult?.nextPage}
												loadingMore={searchWhatsNewArticlesState === REQUEST_STATE.loading}
											/>
										) : (
											<WhatsNewResultsEmpty onClearFilter={handleOnClearFilter} />
										)}
									</WhatsNewResultsListContainer>
								</>
							)}

						{searchWhatsNewArticlesState === REQUEST_STATE.error && (
							<WhatsNewResultsError onSearch={onSearchWhatsNewArticles} />
						)}
					</div>
				) : (
					<div
						ref={containerRef}
						css={whatsNewResultsContainerStyles}
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							...transitionStyles[state],
						}}
					>
						{searchWhatsNewArticlesState === REQUEST_STATE.loading &&
							searchWhatsNewArticlesResult === null &&
							state !== 'exited' && <WhatsNewResultsLoading />}
						{(searchWhatsNewArticlesState === REQUEST_STATE.done ||
							searchWhatsNewArticlesState === REQUEST_STATE.loading) &&
							searchWhatsNewArticlesResult !== null &&
							state !== 'exited' && (
								<>
									<SelectContainer>
										<Label htmlFor="help_whats_new_filter_select_label">
											{formatMessage(messages.help_whats_new_filter_select_label)}
										</Label>
										<Select
											defaultValue={selectedOption}
											// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
											className="single-select"
											classNamePrefix="react-select"
											inputId="help_whats_new_filter_select_label"
											options={[
												{
													value: '',
													label: formatMessage(messages.help_whats_new_filter_select_option_all),
												},
												{
													value: WHATS_NEW_ITEM_TYPES.NEW_FEATURE,
													label: formatMessage(messages.help_whats_new_filter_select_option_new),
												},
												{
													label: formatMessage(
														messages.help_whats_new_filter_select_option_improvement,
													),
													value: WHATS_NEW_ITEM_TYPES.IMPROVEMENT,
												},
												{
													label: formatMessage(messages.help_whats_new_filter_select_option_fix),
													value: WHATS_NEW_ITEM_TYPES.FIX,
												},
												{
													label: formatMessage(
														messages.help_whats_new_filter_select_option_removed,
													),
													value: WHATS_NEW_ITEM_TYPES.REMOVED,
												},
												{
													label: formatMessage(
														messages.help_whats_new_filter_select_option_experiment,
													),
													value: WHATS_NEW_ITEM_TYPES.EXPERIMENT,
												},
											]}
											value={selectedOption}
											onChange={(option) => {
												if (onSearchWhatsNewArticles) {
													const selectedOptionValue = (
														option as {
															value: string;
														}
													).value as WHATS_NEW_ITEM_TYPES | '';
													const selectedOptionLabel = (
														option as {
															label: string;
														}
													).label as string;
													setSelectedOption({
														value: selectedOptionValue,
														label: selectedOptionLabel,
													});
													onSearchWhatsNewArticles(
														selectedOptionValue,
														NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE,
														'',
													);
												}
											}}
										/>
									</SelectContainer>
									<WhatsNewResultsListContainer>
										{searchWhatsNewArticlesResult.articles.length > 0 ? (
											<WhatsNewResultsList
												whatsNewArticles={searchWhatsNewArticlesResult.articles}
												onWhatsNewResultItemClick={onWhatsNewResultItemClick}
												onShowMoreButtonClick={handleOnShowMoreButtonClick}
												hasNextPage={searchWhatsNewArticlesResult?.hasNextPage}
												nextPage={searchWhatsNewArticlesResult?.nextPage}
												loadingMore={searchWhatsNewArticlesState === REQUEST_STATE.loading}
											/>
										) : (
											<WhatsNewResultsEmpty onClearFilter={handleOnClearFilter} />
										)}
									</WhatsNewResultsListContainer>
								</>
							)}

						{searchWhatsNewArticlesState === REQUEST_STATE.error && (
							<WhatsNewResultsError onSearch={onSearchWhatsNewArticles} />
						)}
					</div>
				)
			}
		</Transition>
	);
};

const _default_1: React.FC<WithIntlProps<WrappedComponentProps>> & {
	WrappedComponent: React.ComponentType<WrappedComponentProps>;
} = injectIntl(WhatsNewResults);
export default _default_1;
