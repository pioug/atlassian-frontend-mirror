/** @jsx jsx */
import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl-next';
import { css, jsx } from '@emotion/core';

import { AtlassianIcon, ConfluenceIcon, JiraIcon } from '@atlaskit/logo';
import Spinner from '@atlaskit/spinner/spinner';

import { SlackIcon } from '../assets/slack';
import { GoogleIcon } from '../assets/google';
import { MicrosoftIcon } from '../assets/microsoft';
import { GitHubIcon } from '../assets/github';
import { messages } from '../i18n';
import { UserSource } from '../../types';
import { ExternalUserSourcesData } from '../ExternalUserSourcesContainer';
import { imageContainer } from './main';

export const sourcesTooltipContainer = css({
  paddingBottom: '4px',
  paddingRight: '4px',
});

export const sourceWrapper = css({
  paddingTop: '4px',
  display: 'flex',
  alignItems: 'center',
});

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
      {!sourcesLoading && sources.length === 0 ? (
        <span>
          <FormattedMessage {...messages.externalUserSourcesError} />
        </span>
      ) : (
        <React.Fragment>
          <span>
            <FormattedMessage {...messages.externalUserSourcesHeading} />
          </span>
          <div css={sourcesTooltipContainer}>
            {sourcesLoading && <Spinner size="small" appearance="invert" />}
            {!sourcesLoading &&
              sourcesToRender.map(({ sourceType, icon, label }) => (
                <div css={sourceWrapper} key={sourceType}>
                  <span css={imageContainer}>{icon}</span>
                  <span>
                    <FormattedMessage {...label} />
                  </span>
                </div>
              ))}
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};
