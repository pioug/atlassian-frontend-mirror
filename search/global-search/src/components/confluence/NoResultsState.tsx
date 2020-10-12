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
  onClick?: (e: CancelableEvent, entity: string) => void;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default class NoResultsState extends React.Component<Props> {
  render() {
    const { query } = this.props;
    const analyticsData = { resultsCount: 0, wasOnNoResultsScreen: true };
    return (
      <>
        <NoResults
          key="no-results"
          title={<FormattedMessage {...messages.no_results_title} />}
          body={<FormattedMessage {...messages.no_results_body} />}
        />
        <ResultItemGroup title="" key="advanced-search">
          <Container>
            <SearchConfluenceItem
              analyticsData={analyticsData}
              isCompact
              query={query}
              text={
                <Button appearance="primary" shouldFitContainer={true}>
                  <FormattedMessage
                    {...messages.confluence_advanced_search_filters}
                  />
                </Button>
              }
              onClick={({ event }) => {
                if (this.props.onClick) {
                  this.props.onClick(
                    event,
                    ConfluenceAdvancedSearchTypes.Content,
                  );
                }
              }}
            />
          </Container>
        </ResultItemGroup>
      </>
    );
  }
}
