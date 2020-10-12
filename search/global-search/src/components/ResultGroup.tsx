import React from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { ResultItemGroup, CancelableEvent } from '@atlaskit/quick-search';
import Badge from '@atlaskit/badge';

import { Result } from '../model/Result';
import ResultList from './ResultList';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import ShowMoreButton from './ShowMoreButton';

export interface Props {
  title?: JSX.Element | string;
  results: Result[];
  sectionIndex: number;
  analyticsData?: {};
  showTotalSize: boolean;
  totalSize: number;
  showMoreButton: boolean;
  onShowMoreClicked: () => void;
  onSearchMoreAdvancedSearch: undefined | ((e: CancelableEvent) => void);
  query: string;
}

const TitlelessGroupWrapper = styled.div`
  margin-top: ${gridSize() * 1.5}px;
`;

const BadgeContainer = styled.span`
  margin-left: ${gridSize()}px;
`;

export class ResultGroup extends React.Component<Props & InjectedIntlProps> {
  render() {
    const {
      title,
      results,
      sectionIndex,
      showTotalSize,
      totalSize,
      showMoreButton,
      onShowMoreClicked,
      onSearchMoreAdvancedSearch,
      query,
    } = this.props;

    if (results.length === 0) {
      return null;
    }

    const moreButton = showMoreButton ? (
      <ShowMoreButton
        resultLength={results.length}
        onShowMoreClicked={onShowMoreClicked}
        onSearchMoreAdvancedSearch={onSearchMoreAdvancedSearch}
        totalSize={totalSize}
        query={query}
        // this will force new show more button every click show more to fix scrolling
        key={`show_more_${results.length}`}
      />
    ) : null;

    if (!title) {
      return (
        <TitlelessGroupWrapper>
          <ResultList
            analyticsData={this.props.analyticsData}
            results={results}
            sectionIndex={sectionIndex}
          />
          {moreButton}
        </TitlelessGroupWrapper>
      );
    }

    const titleView = showTotalSize ? (
      <>
        <span>{title}</span>
        <BadgeContainer>
          <Badge max={99}>{totalSize}</Badge>
        </BadgeContainer>
      </>
    ) : (
      <span>{title}</span>
    );

    return (
      <ResultItemGroup title={titleView}>
        <ResultList
          analyticsData={this.props.analyticsData}
          results={results}
          sectionIndex={sectionIndex}
        />
        {moreButton}
      </ResultItemGroup>
    );
  }
}

export default injectIntl(ResultGroup);
