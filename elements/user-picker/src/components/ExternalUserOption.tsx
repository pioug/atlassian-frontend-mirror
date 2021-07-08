import { B400, N200, N800 } from '@atlaskit/theme/colors';
import React, { ReactNode } from 'react';
import { ExternalUser, UserSource } from '../types';
import { AvatarItemOption, TextWrapper } from './AvatarItemOption';
import { SizeableAvatar } from './SizeableAvatar';
import EditorPanelIcon from '@atlaskit/icon/glyph/editor/panel';
import Tooltip from '@atlaskit/tooltip';
import styled from 'styled-components';
import { SlackIcon } from './assets/slack';
import { GoogleIcon } from './assets/google';
import { MicrosoftIcon } from './assets/microsoft';
import { GitHubIcon } from './assets/github';
import { FormattedMessage } from 'react-intl';
import { messages } from './i18n';

export const ImageContainer = styled.span`
  height: 12px;
  width: 12px;
  padding-right: 4px;
`;

export const SourcesTooltipContainer = styled.div`
  padding-bottom: 4px;
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
      <TextWrapper key="name" color={this.props.isSelected ? B400 : N800}>
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
      <TextWrapper color={this.props.isSelected ? B400 : N200}>
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
    this.props.user.sources?.length > 0 ? (
      <Tooltip
        content={this.formattedTooltipContent()}
        position={'right-start'}
      >
        <EditorPanelIcon label="" size="large" primaryColor={N200} />
      </Tooltip>
    ) : undefined;

  private formattedTooltipContent() {
    return (
      <React.Fragment>
        <span>
          <FormattedMessage {...messages.externalUserSourcesHeading} />
        </span>
        <SourcesTooltipContainer>
          {(this.props.user.sources
            .map((s) => SourcesInfoMap.get(s))
            .filter((s) => s) as SourceInfo[]).map(({ key, icon, label }) => (
            <SourceWrapper key={key}>
              <ImageContainer>{icon}</ImageContainer>
              <span>
                <FormattedMessage {...label} />
              </span>
            </SourceWrapper>
          ))}
        </SourcesTooltipContainer>
      </React.Fragment>
    );
  }
}
