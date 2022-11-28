/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/core';
import { B400, N200, N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';
import Tooltip from '@atlaskit/tooltip';
import {
  AnalyticsEventPayload,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';

import {
  createAndFireEventInElementsChannel,
  userInfoEvent,
} from '../../analytics';
import { ExternalUser } from '../../types';
import { textWrapper } from '../AvatarItemOption';
import { SizeableAvatar } from '../SizeableAvatar';
import { ExternalUserSourcesContainer } from '../ExternalUserSourcesContainer';
import InfoIcon from './InfoIcon';
import { ExternalAvatarItemOption } from './ExternalAvatarItemOption';
import { SourcesTooltipContent } from './SourcesTooltipContent';

export const imageContainer = css({
  height: '16px',
  width: '16px',
  paddingRight: '4px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const emailDomainWrapper = css({
  fontWeight: 'bold',
});

export type ExternalUserOptionProps = WithAnalyticsEventsProps & {
  user: ExternalUser;
  status?: string;
  isSelected: boolean;
};

class ExternalUserOptionImpl extends React.PureComponent<ExternalUserOptionProps> {
  render() {
    return (
      <ExternalAvatarItemOption
        avatar={this.renderAvatar()}
        isDisabled={this.props.user.isDisabled}
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
      <span
        key="name"
        css={textWrapper(
          this.props.isSelected
            ? token('color.text.selected', B400)
            : token('color.text', N800),
        )}
      >
        {name}
      </span>
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
      <span
        css={textWrapper(
          this.props.isSelected
            ? token('color.text.selected', B400)
            : token('color.text.subtlest', N200),
        )}
      >
        {emailUser}
        <span css={emailDomainWrapper}>{emailDomainWithAt}</span>
      </span>
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

  private fireEvent = <Args extends unknown[]>(
    eventCreator: (...args: Args) => AnalyticsEventPayload,
    ...args: Args
  ) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      createAndFireEventInElementsChannel(eventCreator(...args))(
        createAnalyticsEvent,
      );
    }
  };

  private onShow = () => {
    const { user } = this.props;
    this.fireEvent(userInfoEvent, user.sources, user.id);
  };

  private getSourcesInfoTooltip = () =>
    this.props.user.isExternal ? (
      <Tooltip
        content={this.formattedTooltipContent()}
        position={'right-start'}
        onShow={this.onShow}
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

export const ExternalUserOption = withAnalyticsEvents()(ExternalUserOptionImpl);
