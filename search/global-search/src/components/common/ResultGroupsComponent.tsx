import React from 'react';
import { ScreenCounter } from '../../util/ScreenCounter';
import { FormattedMessage } from 'react-intl';
import ResultGroup from '../ResultGroup';
import {
  PreQueryAnalyticsComponent,
  PostQueryAnalyticsComponent,
} from './ScreenAnalyticsHelper';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import { ResultsGroup } from '../../model/Result';
import { Scope } from '../../api/types';
import { CancelableEvent } from '@atlaskit/quick-search';

export enum ResultGroupType {
  PreQuery = 'PreQuery',
  PostQuery = 'PostQuery',
}

export interface Props {
  resultsGroups: ResultsGroup[];
  type: ResultGroupType;
  renderAdvancedSearch: (analyticsData?: any) => JSX.Element;
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  onShowMoreClicked: (scope: Scope) => void;
  onSearchMoreAdvancedSearchClicked?: (event: CancelableEvent) => void;
  query: string;
}

export default class ResultGroupsComponent extends React.Component<Props> {
  mapGroupsToSections = (
    resultsToShow: ResultsGroup[],
    analyticsData: any,
  ): JSX.Element[] => {
    const {
      onShowMoreClicked,
      onSearchMoreAdvancedSearchClicked,
      query,
    } = this.props;

    return resultsToShow
      .filter(({ items }) => items && items.length)
      .map((group, index) => (
        <ResultGroup
          key={`${group.key}-${index}`}
          title={
            group.title ? <FormattedMessage {...group.title} /> : undefined
          }
          results={group.items}
          sectionIndex={index}
          analyticsData={analyticsData}
          showTotalSize={group.showTotalSize}
          totalSize={group.totalSize}
          showMoreButton={group.showTotalSize}
          onShowMoreClicked={() => onShowMoreClicked(group.key as Scope)}
          onSearchMoreAdvancedSearch={onSearchMoreAdvancedSearchClicked}
          query={query}
        />
      ));
  };

  getAnalyticsComponent() {
    const {
      searchSessionId,
      screenCounter,
      referralContextIdentifiers,
      type,
    } = this.props;
    switch (type) {
      case ResultGroupType.PreQuery:
        return (
          <PreQueryAnalyticsComponent
            key="pre-query-analytics"
            screenCounter={screenCounter}
            searchSessionId={searchSessionId}
            referralContextIdentifiers={referralContextIdentifiers}
          />
        );
      case ResultGroupType.PostQuery:
        return (
          <PostQueryAnalyticsComponent
            key="post-query-analytics"
            screenCounter={screenCounter}
            searchSessionId={searchSessionId}
            referralContextIdentifiers={referralContextIdentifiers}
          />
        );
    }
  }

  getAnalyticsData = () => ({
    resultCount: this.props.resultsGroups
      .map(({ items }) => items.length)
      .reduce((total, count) => total + count, 0),
  });

  render() {
    const { renderAdvancedSearch, resultsGroups } = this.props;
    const analyticsData = this.getAnalyticsData();
    return (
      <>
        {this.mapGroupsToSections(resultsGroups, analyticsData)}
        {renderAdvancedSearch(analyticsData)}
        {this.getAnalyticsComponent()}
      </>
    );
  }
}
