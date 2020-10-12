import React from 'react';
import { ResultItemGroup, CancelableEvent } from '@atlaskit/quick-search';
import Button from '@atlaskit/button/custom-theme-button';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';
import { FilterWithMetadata } from '../../api/CrossProductSearchClient';
import ConfluenceSpaceFilter from './SpaceFilter';
import styled from 'styled-components';
import { fireMoreFiltersButtonClickEvent } from '../../util/analytics-event-helper';
import { CreateAnalyticsEventFn } from '../analytics/types';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

export interface Props {
  spaceAvatar: string;
  spaceTitle: string;
  spaceKey: string;
  isDisabled?: boolean;
  isFilterOn: boolean;
  onFilterChanged(filter: FilterWithMetadata[]): void;
  onAdvancedSearch(event: CancelableEvent): void;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  searchSessionId: string;
}

const Container = styled.span`
  display: inline-flex;
  align-items: center;
  max-width: 100%;
`;

const ButtonContainer = styled.div`
  flex-shrink: 0;
`;

const FilterContainer = styled.div`
  flex-shrink: 1;
  overflow: hidden;
`;

export class ConfluenceFilterGroup extends React.Component<Props> {
  onMoreFiltersClick = (event: CancelableEvent) => {
    const {
      onAdvancedSearch,
      createAnalyticsEvent,
      searchSessionId,
    } = this.props;
    fireMoreFiltersButtonClickEvent(searchSessionId, createAnalyticsEvent);
    onAdvancedSearch(event);
  };

  render() {
    return (
      <ResultItemGroup
        title={<FormattedMessage {...messages.confluence_space_filter} />}
      >
        <Container>
          <FilterContainer>
            <ConfluenceSpaceFilter {...this.props} />
          </FilterContainer>
          <ButtonContainer>
            <Button appearance="link" onClick={this.onMoreFiltersClick}>
              <FormattedMessage {...messages.confluence_more_filters} />
            </Button>
          </ButtonContainer>
        </Container>
      </ResultItemGroup>
    );
  }
}

export default withAnalyticsEvents()(ConfluenceFilterGroup);
