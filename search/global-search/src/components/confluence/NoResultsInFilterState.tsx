import React from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button/custom-theme-button';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { FormattedMessage } from 'react-intl';
import { CancelableEvent } from '@atlaskit/quick-search';
import { messages } from '../../messages';
import NoResults from '../NoResults';
import SearchConfluenceItem from '../SearchConfluenceItem';
import { ConfluenceAdvancedSearchTypes } from '../SearchResultsUtil';

export interface Props {
  query: string;
  onClickAdvancedSearch?: (e: CancelableEvent, entity: string) => void;
  onClearFilters: () => void;
  spaceTitle: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default class NoResultsInFilterState extends React.Component<Props> {
  render() {
    const { query, spaceTitle, onClearFilters } = this.props;
    const analyticsData = { resultsCount: 0, wasOnNoResultsScreen: true };
    return (
      <>
        <NoResults
          key="no-results"
          title={
            <FormattedMessage
              {...messages.confluence_no_results_in_space}
              values={{ spaceTitle }}
            />
          }
        />
        <ResultItemGroup title="" key="advanced-search">
          <Container>
            <Button appearance="primary" onClick={onClearFilters}>
              <FormattedMessage {...messages.confluence_remove_space_filter} />
            </Button>
            <SearchConfluenceItem
              analyticsData={analyticsData}
              isCompact
              query={query}
              text={
                <Button
                  shouldFitContainer={true}
                  onClick={event => {
                    if (this.props.onClickAdvancedSearch) {
                      this.props.onClickAdvancedSearch(
                        event,
                        ConfluenceAdvancedSearchTypes.Content,
                      );
                    }
                  }}
                >
                  <FormattedMessage {...messages.confluence_advanced_search} />
                </Button>
              }
            />
          </Container>
        </ResultItemGroup>
      </>
    );
  }
}
