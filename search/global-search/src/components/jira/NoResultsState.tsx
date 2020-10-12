import React from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';
import { messages } from '../../messages';
import NoResults from '../NoResults';
import { ResultItemGroup, CancelableEvent } from '@atlaskit/quick-search';
import JiraAdvancedSearch from './JiraAdvancedSearch';
import { JiraEntityTypes } from '../SearchResultsUtil';

export interface Props {
  query: string;
  onAdvancedSearch?: (e: CancelableEvent, entity: JiraEntityTypes) => void;
  isJiraPeopleProfilesEnabled?: boolean;
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export default class NoResultsState extends React.Component<Props> {
  render() {
    const { query, onAdvancedSearch, isJiraPeopleProfilesEnabled } = this.props;

    return (
      <>
        <NoResults
          key="no-results"
          title={<FormattedMessage {...messages.jira_no_results_title} />}
          body={<FormattedMessage {...messages.jira_no_results_body} />}
        />
        <ResultItemGroup title="" key="advanced-search">
          <Container>
            <JiraAdvancedSearch
              query={query}
              analyticsData={{ resultsCount: 0, wasOnNoResultsScreen: true }}
              onClick={onAdvancedSearch}
              isJiraPeopleProfilesEnabled={isJiraPeopleProfilesEnabled}
            />
          </Container>
        </ResultItemGroup>
      </>
    );
  }
}
