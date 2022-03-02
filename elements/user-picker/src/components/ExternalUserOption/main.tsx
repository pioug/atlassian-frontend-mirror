import React from 'react';
import styled from 'styled-components';
import { B400, N200, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import { ExternalUser } from '../../types';
import { TextWrapper } from '../AvatarItemOption';
import { SizeableAvatar } from '../SizeableAvatar';

import { ExternalUserSourcesContainer } from '../ExternalUserSourcesContainer';
import InfoIcon from './InfoIcon';
import { ExternalAvatarItemOption } from './ExternalAvatarItemOption';
import { SourcesTooltipContent } from './SourcesTooltipContent';

export const ImageContainer = styled.span`
  height: 16px;
  width: 16px;
  padding-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EmailDomainWrapper = styled.span`
  font-weight: bold;
`;

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
      <ExternalAvatarItemOption
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
            ? token('color.text.brand', B400)
            : token('color.text', N800)
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
            ? token('color.text.brand', B400)
            : token('color.text.subtlest', N200)
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
        <InfoIcon />
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
        {(sourceData) => <SourcesTooltipContent {...sourceData} />}
      </ExternalUserSourcesContainer>
    );
  }
}
