import React from 'react';
import styled from 'styled-components';
import { colors } from '@atlaskit/theme';
import SearchIcon from '@atlaskit/icon/glyph/search';
import {
  ObjectResult as ObjectResultComponent,
  PersonResult as PersonResultComponent,
  ContainerResult as ContainerResultComponent,
  ResultBase,
} from '@atlaskit/quick-search';
import { FormattedMessage } from 'react-intl';
import { messages } from '../messages';
import {
  Result,
  ContainerResult,
  JiraResult,
  PersonResult,
  ResultType,
  ConfluenceObjectResult,
  JiraProjectType,
  ContentType,
  AnalyticsType,
} from '../model/Result';
import { SelectedIcon } from './styled';
import { getAvatarForConfluenceObjectResult } from '../util/confluence-avatar-util';
import { getDefaultAvatar } from '../util/jira-avatar-util';
import DarkReturn from '../assets/DarkReturn';
import Return from '../assets/Return';
import { injectFeatures } from './FeaturesProvider';
import { ConfluenceFeatures, JiraFeatures } from '../util/features';

export interface Props {
  results: Result[];
  sectionIndex: number;
  analyticsData?: {};
  features: ConfluenceFeatures | JiraFeatures; // this component is shared
}

const extractAvatarData = (jiraResult: JiraResult) =>
  jiraResult.avatarUrl
    ? { avatarUrl: jiraResult.avatarUrl }
    : {
        avatar: getDefaultAvatar(jiraResult.contentType),
      };

const selectedIcon = (
  <SelectedIcon>
    <DarkReturn />
  </SelectedIcon>
);

const getI18nJiraContainerName = (
  projectType: JiraProjectType,
): JSX.Element | undefined => {
  switch (projectType) {
    case JiraProjectType.Business: {
      return (
        <FormattedMessage {...messages.jira_project_type_business_project} />
      );
    }
    case JiraProjectType.Software: {
      return (
        <FormattedMessage {...messages.jira_project_type_software_project} />
      );
    }
    case JiraProjectType.ServiceDesk: {
      return (
        <FormattedMessage
          {...messages.jira_project_type_service_desk_project}
        />
      );
    }
    case JiraProjectType.Ops: {
      return <FormattedMessage {...messages.jira_project_type_ops_project} />;
    }
  }
};

const getI18nJiraContentType = (
  contentType: ContentType,
): JSX.Element | undefined => {
  switch (contentType) {
    case ContentType.JiraBoard: {
      return <FormattedMessage {...messages.jira_result_type_board} />;
    }
    case ContentType.JiraFilter: {
      return <FormattedMessage {...messages.jira_result_type_filter} />;
    }
  }
  return undefined;
};

// Being tested as part of the 'complex' experiment, to improve scannability when there
// is lots of text.
const LightSubtextWrapper = styled.span`
  color: ${colors.N90};
`;

const getI18nConfluenceContainerSubtext = (
  containerName: string,
  friendlyLastModified: string | undefined,
) => {
  const containerText = friendlyLastModified ? (
    <FormattedMessage
      {...messages.confluence_container_subtext_with_modified_date}
      values={{
        containerName,
        friendlyLastModified,
      }}
    />
  ) : (
    containerName
  );

  return <LightSubtextWrapper>{containerText}</LightSubtextWrapper>;
};

export const getUniqueResultId = (result: Result): string =>
  result.key ? result.key : `${result.contentType}-${result.resultId}`;

class ResultList extends React.Component<Props> {
  render() {
    const { results, sectionIndex, features } = this.props;

    return results.map((result, index) => {
      const resultType: ResultType = result.resultType;
      const analyticsData = {
        sectionIndex,
        indexWithinSection: index,
        containerId: result.containerId,
        experimentId: result.experimentId,
        ...this.props.analyticsData,
        contentType: result.contentType,
        resultId: result.resultId,
        isRecentResult: !!result.isRecentResult,
      };

      // Make sure that key and resultId are unique across all search results
      const uniqueResultId = getUniqueResultId(result);
      const uniqueKey = `${uniqueResultId}_${Date.now()}`; // same result might appear on two successive search

      switch (resultType) {
        case ResultType.ConfluenceObjectResult: {
          const confluenceResult = result as ConfluenceObjectResult;

          const subText = getI18nConfluenceContainerSubtext(
            confluenceResult.containerName,
            confluenceResult.friendlyLastModified,
          );

          return (
            <ObjectResultComponent
              key={uniqueKey}
              resultId={uniqueResultId}
              name={confluenceResult.name}
              href={confluenceResult.href}
              type={confluenceResult.analyticsType}
              containerName={subText}
              avatar={getAvatarForConfluenceObjectResult(confluenceResult)}
              analyticsData={analyticsData}
              selectedIcon={selectedIcon}
            />
          );
        }
        case ResultType.JiraProjectResult: {
          const jiraResult = result as JiraResult;
          const avatarData = extractAvatarData(jiraResult);

          const containerNameElement = jiraResult.projectType
            ? getI18nJiraContainerName(jiraResult.projectType)
            : null;

          return (
            <ContainerResultComponent
              key={uniqueKey}
              resultId={uniqueResultId}
              name={jiraResult.name}
              href={jiraResult.href}
              type={jiraResult.analyticsType}
              subText={containerNameElement}
              {...avatarData}
              analyticsData={analyticsData}
              selectedIcon={selectedIcon}
            />
          );
        }
        case ResultType.JiraObjectResult: {
          const jiraResult = result as JiraResult;
          const avatarData = extractAvatarData(jiraResult);

          const objectKey =
            jiraResult.contentType === 'jira-board' ||
            jiraResult.contentType === 'jira-filter'
              ? getI18nJiraContentType(jiraResult.contentType)
              : jiraResult.objectKey;

          return (
            <ObjectResultComponent
              key={uniqueKey}
              resultId={uniqueResultId}
              name={jiraResult.name}
              href={jiraResult.href}
              type={jiraResult.analyticsType}
              objectKey={objectKey}
              containerName={jiraResult.containerName}
              {...avatarData}
              analyticsData={analyticsData}
              selectedIcon={selectedIcon}
            />
          );
        }
        case ResultType.GenericContainerResult: {
          const containerResult = result as ContainerResult;
          return (
            <ContainerResultComponent
              key={uniqueKey}
              resultId={uniqueResultId}
              name={containerResult.name}
              href={containerResult.href}
              type={containerResult.analyticsType}
              avatarUrl={containerResult.avatarUrl}
              analyticsData={analyticsData}
              selectedIcon={selectedIcon}
            />
          );
        }
        case ResultType.PersonResult: {
          const personResult = result as PersonResult;

          const presenceMessage = features.complexSearchExtensionsEnabled ? (
            <LightSubtextWrapper>
              {personResult.presenceMessage}
            </LightSubtextWrapper>
          ) : (
            personResult.presenceMessage
          );

          return (
            <PersonResultComponent
              key={uniqueKey}
              resultId={uniqueResultId}
              name={personResult.name}
              href={personResult.href}
              type={personResult.analyticsType}
              avatarUrl={personResult.avatarUrl}
              mentionName={personResult.mentionName}
              presenceMessage={presenceMessage}
              analyticsData={analyticsData}
              selectedIcon={selectedIcon}
              target="_blank"
            />
          );
        }

        case ResultType.JiraIssueAdvancedSearch: {
          return (
            <ResultBase
              href={result.href}
              resultId="jira-advanced-issue-search"
              text={<FormattedMessage {...messages.jira_view_all_issues} />}
              icon={<SearchIcon size="medium" label="View all issues" />}
              type={AnalyticsType.LinkPostQueryAdvancedSearchJira}
              key={uniqueKey}
              elemAfter={<Return />}
            />
          );
        }
        default: {
          // Make the TS compiler verify that all enums have been matched
          const _nonExhaustiveMatch: never = resultType;
          throw new Error(
            `Non-exhaustive match for result type: ${_nonExhaustiveMatch}`,
          );
        }
      }
    });
  }
}

export const UnwrappedResultList = ResultList;

export default injectFeatures(ResultList);
