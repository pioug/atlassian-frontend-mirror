import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl-next';
import styled from 'styled-components';

import { AtlassianIcon, ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import Spinner from '@atlaskit/spinner/spinner';

import { SlackIcon } from '../assets/slack';
import { GoogleIcon } from '../assets/google';
import { MicrosoftIcon } from '../assets/microsoft';
import { GitHubIcon } from '../assets/github';
import { messages } from '../i18n';
import { UserSource } from '../../types';
import { ExternalUserSourcesData } from '../ExternalUserSourcesContainer';
import { ImageContainer } from './main';

export const SourcesTooltipContainer = styled.div`
  padding-bottom: 4px;
  padding-right: 4px;
`;

export const SourceWrapper = styled.div`
  padding-top: 4px;
  display: flex;
  align-items: center;
`;

type RenderableSource = {
  sourceType: UserSource;
  icon: ReactNode;
  label: { id: string; defaultMessage: string; description: string };
};

const SUPPORTED_SOURCES: RenderableSource[] = [
  {
    sourceType: 'jira',
    icon: <JiraIcon size={'xsmall'} />,
    label: messages.jiraSource,
  },
  {
    sourceType: 'confluence',
    icon: <ConfluenceIcon size={'xsmall'} />,
    label: messages.confluenceSource,
  },
  {
    sourceType: 'other-atlassian',
    icon: <AtlassianIcon size={'xsmall'} />,
    label: messages.otherAtlassianSource,
  },
  { sourceType: 'slack', icon: <SlackIcon />, label: messages.slackProvider },
  {
    sourceType: 'google',
    icon: <GoogleIcon />,
    label: messages.googleProvider,
  },
  {
    sourceType: 'microsoft',
    icon: <MicrosoftIcon />,
    label: messages.microsoftProvider,
  },
  {
    sourceType: 'github',
    icon: <GitHubIcon />,
    label: messages.gitHubProvider,
  },
];

export const SourcesTooltipContent: React.FC<ExternalUserSourcesData> = ({
  sources,
  sourcesLoading,
  sourcesError,
}) => {
  const sourcesToRender = React.useMemo(
    () =>
      SUPPORTED_SOURCES.filter((supportedSource) =>
        sources.includes(supportedSource.sourceType),
      ),
    [sources],
  );
  return (
    <React.Fragment>
      {/* If fetching fails but we have static sources, just show them instead of the error message */}
      {sourcesError !== null && sources.length === 0 ? (
        <span>
          <FormattedMessage {...messages.externalUserSourcesError} />
        </span>
      ) : (
        <React.Fragment>
          <span>
            <FormattedMessage {...messages.externalUserSourcesHeading} />
          </span>
          <SourcesTooltipContainer>
            {sourcesLoading && <Spinner size="small" appearance="invert" />}
            {!sourcesLoading &&
              sourcesToRender.map(({ sourceType, icon, label }) => (
                <SourceWrapper key={sourceType}>
                  <ImageContainer>{icon}</ImageContainer>
                  <span>
                    <FormattedMessage {...label} />
                  </span>
                </SourceWrapper>
              ))}
          </SourcesTooltipContainer>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
