import React, { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl-next';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import { ConfluenceIcon } from '@atlaskit/logo/confluence-icon';
import { JiraIcon } from '@atlaskit/logo/jira-icon';
import Tooltip from '@atlaskit/tooltip';
import Spinner from '@atlaskit/spinner';
import { B400, N200, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import { ExternalUser, UserSource } from '../../types';
import { AvatarItemOption, TextWrapper } from '../AvatarItemOption';
import { SizeableAvatar } from '../SizeableAvatar';
import styled from 'styled-components';
import { SlackIcon } from '../assets/slack';
import { GoogleIcon } from '../assets/google';
import { MicrosoftIcon } from '../assets/microsoft';
import { GitHubIcon } from '../assets/github';
import { messages } from '../i18n';
import { ExternalUserSourcesContainer } from '../ExternalUserSourcesContainer';

export const ImageContainer = styled.span`
  height: 16px;
  width: 16px;
  padding-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const SourcesTooltipContainer = styled.div`
  padding-bottom: 4px;
  padding-right: 4px;
`;

export const SourceWrapper = styled.div`
  padding-top: 4px;
  display: flex;
  align-items: center;
`;

export const EmailDomainWrapper = styled.span`
  font-weight: bold;
`;

type SourceInfo = {
  key: string;
  icon: ReactNode;
  label: { id: string; defaultMessage: string; description: string };
};

const SourcesInfoMap = new Map<UserSource, SourceInfo>([
  [
    'slack',
    { key: 'slack', icon: <SlackIcon />, label: messages.slackProvider },
  ],
  [
    'google',
    { key: 'google', icon: <GoogleIcon />, label: messages.googleProvider },
  ],
  [
    'microsoft',
    {
      key: 'microsoft',
      icon: <MicrosoftIcon />,
      label: messages.microsoftProvider,
    },
  ],
  [
    'github',
    { key: 'github', icon: <GitHubIcon />, label: messages.gitHubProvider },
  ],
  [
    'jira',
    {
      key: 'jira',
      icon: <JiraIcon size={'xsmall'} />,
      label: messages.jiraSource,
    },
  ],
  [
    'confluence',
    {
      key: 'confluence',
      icon: <ConfluenceIcon size={'xsmall'} />,
      label: messages.confluenceSource,
    },
  ],
]);

export type ExternalUserOptionProps = {
  user: ExternalUser;
  status?: string;
  isSelected: boolean;
};

export class ExternalUserOption extends React.PureComponent<
  ExternalUserOptionProps
> {
  render() {
    return (
      <AvatarItemOption
        avatar={this.renderAvatar()}
        primaryText={this.getPrimaryText()}
        secondaryText={this.renderSecondaryText()}
        sourcesInfoTooltip={this.getSourcesInfoTooltip()}
      />
    );
  }

  private getPrimaryText = () => {
    const {
      user: { name },
    } = this.props;

    return (
      <TextWrapper
        key="name"
        color={
          this.props.isSelected
            ? token('color.text.selected', B400)
            : token('color.text.highEmphasis', N800)
        }
      >
        {name}
      </TextWrapper>
    );
  };

  private renderSecondaryText = () => {
    const { email } = this.props.user;
    if (!email) {
      return;
    }

    const [emailUser, emailDomain] = email.split('@');
    const emailDomainWithAt = `@${emailDomain}`;
    return (
      <TextWrapper
        color={
          this.props.isSelected
            ? token('color.text.selected', B400)
            : token('color.text.lowEmphasis', N200)
        }
      >
        {emailUser}
        <EmailDomainWrapper>{emailDomainWithAt}</EmailDomainWrapper>
      </TextWrapper>
    );
  };

  private renderAvatar = () => {
    const {
      user: { avatarUrl, name },
      status,
    } = this.props;
    return (
      <SizeableAvatar
        appearance="big"
        src={avatarUrl}
        presence={status}
        name={name}
      />
    );
  };

  private getSourcesInfoTooltip = () =>
    this.props.user.isExternal ? (
      <Tooltip
        content={this.formattedTooltipContent()}
        position={'right-start'}
      >
        <EditorPanelIcon
          testId="source-icon"
          label=""
          size="large"
          primaryColor={token('color.text.lowEmphasis', N200)}
        />
      </Tooltip>
    ) : undefined;

  private formattedTooltipContent() {
    const {
      user: { id, requiresSourceHydration, sources },
    } = this.props;
    return (
      <ExternalUserSourcesContainer
        accountId={id}
        shouldFetchSources={Boolean(requiresSourceHydration)}
        initialSources={sources}
      >
        {({ sources, sourcesLoading, sourcesError }) => (
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
                  {sourcesLoading && (
                    <Spinner size="small" appearance="invert" />
                  )}
                  {!sourcesLoading &&
                    (sources
                      .map((s) => SourcesInfoMap.get(s))
                      .filter((s) => s) as SourceInfo[]).map(
                      ({ key, icon, label }) => (
                        <SourceWrapper key={key}>
                          <ImageContainer>{icon}</ImageContainer>
                          <span>
                            <FormattedMessage {...label} />
                          </span>
                        </SourceWrapper>
                      ),
                    )}
                </SourcesTooltipContainer>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </ExternalUserSourcesContainer>
    );
  }
}
