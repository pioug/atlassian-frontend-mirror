import React, { useCallback, useState } from 'react';
import { Transition } from 'react-transition-group';
import Select from '@atlaskit/select';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { VIEW } from '../../constants';

import { messages } from '../../../messages';
import { WHATS_NEW_ITEM_TYPES } from '../../../model/WhatsNew';
import { REQUEST_STATE } from '../../../model/Requests';

import {
  FADEIN_OVERLAY_TRANSITION_DURATION_MS,
  TRANSITION_STATUS,
  NUMBER_OF_WHATS_NEW_ITEMS_PER_PAGE,
} from '../../constants';
import { useWhatsNewArticleContext } from '../../contexts/whatsNewArticleContext';
import { useNavigationContext } from '../../contexts/navigationContext';

import WhatsNewResultsEmpty from './WhatsNewResultsEmpty';
import WhatsNewResultsError from './WhatsNewResultsError';
import WhatsNewResultsLoading from './WhatsNewResultsLoading';
import WhatsNewResultsList from './WhatsNewResultsList';
import {
  WhatsNewResultsContainer,
  SelectContainer,
  WhatsNewResultsListContainer,
} from './styled';

const defaultStyle: Partial<{ [index: string]: string | number | null }> = {
  transition: `opacity ${FADEIN_OVERLAY_TRANSITION_DURATION_MS}ms`,
  opacity: 0,
  visibility: 'hidden',
};

const transitionStyles: {
  [id: string]: { [index: string]: string | number | null };
} = {
  entering: { opacity: 1, visibility: 'visible' },
  entered: { opacity: 1, visibility: 'visible' },
  exiting: { opacity: 0, visibility: 'visible' },
  exited: { opacity: 0, visibility: 'hidden' },
};

export const WhatsNewResults: React.FC<InjectedIntlProps> = ({
  intl: { formatMessage },
}) => {
  const { view: helpContextView } = useNavigationContext();
  const {
    searchWhatsNewArticlesResult,
    onSearchWhatsNewArticles,
    searchWhatsNewArticlesState,
    onWhatsNewButtonClick,
  } = useWhatsNewArticleContext();
  const SELECT_DEFAULT_VALUE: {
    value: WHATS_NEW_ITEM_TYPES | '';
    label: string;
  } = {
    value: '',
    label: formatMessage(messages.help_whats_new_filter_select_option_all),
  };

  const [selectedOption, setSelectedOption] = useState<{
    value: WHATS_NEW_ITEM_TYPES | '';
    label: string;
  }>(SELECT_DEFAULT_VALUE);

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
    setSelectedOption(SELECT_DEFAULT_VALUE);
    onSearchWhatsNewArticles && onSearchWhatsNewArticles();
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
    >
      {(state: TRANSITION_STATUS) => (
        <WhatsNewResultsContainer
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
        >
          {searchWhatsNewArticlesState !== REQUEST_STATE.error && (
            <SelectContainer>
              <Select
                defaultValue={selectedOption}
                className="single-select"
                classNamePrefix="react-select"
                options={[
                  {
                    value: '',
                    label: formatMessage(
                      messages.help_whats_new_filter_select_option_all,
                    ),
                  },
                  {
                    value: WHATS_NEW_ITEM_TYPES.NEW_FEATURE,
                    label: formatMessage(
                      messages.help_whats_new_filter_select_option_new,
                    ),
                  },
                  {
                    label: formatMessage(
                      messages.help_whats_new_filter_select_option_improvement,
                    ),
                    value: WHATS_NEW_ITEM_TYPES.IMPROVEMENT,
                  },
                  {
                    label: formatMessage(
                      messages.help_whats_new_filter_select_option_fix,
                    ),
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
                    const selectedOptionValue = (option as { value: string })
                      .value as WHATS_NEW_ITEM_TYPES | '';
                    const selectedOptionLabel = (option as { label: string })
                      .label as string;
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
          )}

          <WhatsNewResultsListContainer>
            {searchWhatsNewArticlesState === REQUEST_STATE.loading &&
              searchWhatsNewArticlesResult === null &&
              state !== 'exited' && <WhatsNewResultsLoading />}
            {(searchWhatsNewArticlesState === REQUEST_STATE.done ||
              searchWhatsNewArticlesState === REQUEST_STATE.loading) &&
              searchWhatsNewArticlesResult !== null &&
              state !== 'exited' && (
                <>
                  {searchWhatsNewArticlesResult.articles.length > 0 ? (
                    <WhatsNewResultsList
                      whatsNewArticles={searchWhatsNewArticlesResult.articles}
                      onWhatsNewResultItemClick={onWhatsNewButtonClick}
                      onShowMoreButtonClick={handleOnShowMoreButtonClick}
                      hasNextPage={searchWhatsNewArticlesResult?.hasNextPage}
                      nextPage={searchWhatsNewArticlesResult?.nextPage}
                      loadingMore={
                        searchWhatsNewArticlesState === REQUEST_STATE.loading
                      }
                    />
                  ) : (
                    <WhatsNewResultsEmpty onClearFilter={handleOnClearFilter} />
                  )}
                </>
              )}

            {searchWhatsNewArticlesState === REQUEST_STATE.error && (
              <WhatsNewResultsError onSearch={onSearchWhatsNewArticles} />
            )}
          </WhatsNewResultsListContainer>
        </WhatsNewResultsContainer>
      )}
    </Transition>
  );
};

export default injectIntl(WhatsNewResults);
