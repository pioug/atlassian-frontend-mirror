import React from 'react';
import { ScreenCounter } from '../../util/ScreenCounter';
import { isEmpty } from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';
import ResultGroupsComponent, {
  ResultGroupType,
} from './ResultGroupsComponent';
import { ResultsGroup } from '../../model/Result';
import { PreQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';

export interface Props {
  resultsGroups: ResultsGroup[];
  searchSessionId: string;
  screenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  renderNoRecentActivity: () => JSX.Element;
  renderAdvancedSearchGroup: (analyticsData?: any) => JSX.Element;
}

export default class PreQueryState extends React.Component<Props> {
  render() {
    const {
      resultsGroups,
      searchSessionId,
      screenCounter,
      renderNoRecentActivity,
      referralContextIdentifiers,
      renderAdvancedSearchGroup,
    } = this.props;

    if (resultsGroups.every(({ items }) => isEmpty(items))) {
      return (
        <>
          <PreQueryAnalyticsComponent
            key="pre-query-analytics"
            screenCounter={screenCounter}
            searchSessionId={searchSessionId}
            referralContextIdentifiers={referralContextIdentifiers}
          />
          <NoRecentActivity key="no-recent-activity">
            {renderNoRecentActivity()}
          </NoRecentActivity>
        </>
      );
    }

    return (
      <ResultGroupsComponent
        key="prequery-results-groups"
        type={ResultGroupType.PreQuery}
        renderAdvancedSearch={renderAdvancedSearchGroup}
        resultsGroups={resultsGroups}
        searchSessionId={searchSessionId}
        screenCounter={screenCounter}
        referralContextIdentifiers={referralContextIdentifiers}
        onShowMoreClicked={() => {}}
        query=""
      />
    );
  }
}
