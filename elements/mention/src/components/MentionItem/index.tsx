import Avatar from '@atlaskit/avatar';
import Lozenge from '@atlaskit/lozenge';
import { N30 } from '@atlaskit/theme/colors';
import React from 'react';
import { token } from '@atlaskit/tokens';
import {
  isRestricted,
  type MentionDescription,
  type OnMentionEvent,
  type Presence,
  type LozengeProps,
} from '../../types';
import { NoAccessLabel } from '../../util/i18n';
import { leftClick } from '../../util/mouse';
import AsyncNoAccessTooltip from '../NoAccessTooltip';
import AsyncLockCircleIcon from '../LockCircleIcon';
import {
  AccessSectionStyle,
  AvatarStyle,
  FullNameStyle,
  InfoSectionStyle,
  MentionItemStyle,
  NameSectionStyle,
  RowStyle,
  TimeStyle,
} from './styles';
import { renderHighlight } from './MentionHighlightHelpers';
import MentionDescriptionByline from '../MentionDescriptionByline';
import MessagesIntlProvider from '../MessagesIntlProvider';

export { MENTION_ITEM_HEIGHT } from './styles';

function renderLozenge(lozenge?: string | LozengeProps) {
  if (typeof lozenge === 'string') {
    return <Lozenge>{lozenge}</Lozenge>;
  }
  if (typeof lozenge === 'object') {
    const { appearance, text } = lozenge;
    return <Lozenge appearance={appearance}>{text}</Lozenge>;
  }
  return null;
}

function renderTime(time?: string) {
  if (time) {
    return <TimeStyle>{time}</TimeStyle>;
  }
  return null;
}

export interface Props {
  mention: MentionDescription;
  selected?: boolean;
  // TODO: Remove onMouseMove -> https://product-fabric.atlassian.net/browse/FS-3897
  onMouseMove?: OnMentionEvent;
  onMouseEnter?: OnMentionEvent;
  onSelection?: OnMentionEvent;
}

export default class MentionItem extends React.PureComponent<Props, {}> {
  // internal, used for callbacks
  private onMentionSelected = (event: React.MouseEvent<any>) => {
    if (leftClick(event) && this.props.onSelection) {
      event.preventDefault();
      this.props.onSelection(this.props.mention, event);
    }
  };

  private onMentionMenuItemMouseMove = (event: React.MouseEvent<any>) => {
    if (this.props.onMouseMove) {
      this.props.onMouseMove(this.props.mention, event);
    }
  };

  private onMentionMenuItemMouseEnter = (event: React.MouseEvent<any>) => {
    if (this.props.onMouseEnter) {
      this.props.onMouseEnter(this.props.mention, event);
    }
  };

  render() {
    const { mention, selected } = this.props;
    const {
      id,
      highlight,
      avatarUrl,
      presence,
      name,
      mentionName,
      lozenge,
      accessLevel,
    } = mention;
    const { status, time } = presence || ({} as Presence);
    const restricted = isRestricted(accessLevel);

    const nameHighlights = highlight && highlight.name;

    const borderColor = selected ? token('color.border', N30) : undefined;

    return (
      <MessagesIntlProvider>
        <MentionItemStyle
          selected={selected}
          onMouseDown={this.onMentionSelected}
          onMouseMove={this.onMentionMenuItemMouseMove}
          onMouseEnter={this.onMentionMenuItemMouseEnter}
          data-mention-id={id}
          data-mention-name={mentionName}
        >
          <RowStyle>
            <AvatarStyle restricted={restricted}>
              <Avatar
                src={avatarUrl}
                size="medium"
                presence={status}
                borderColor={borderColor}
              />
            </AvatarStyle>
            <NameSectionStyle restricted={restricted}>
              {renderHighlight(FullNameStyle, name, nameHighlights)}
              <MentionDescriptionByline mention={mention} />
            </NameSectionStyle>
            <InfoSectionStyle restricted={restricted}>
              {renderLozenge(lozenge)}
              {renderTime(time)}
            </InfoSectionStyle>
            {restricted ? (
              <React.Suspense fallback={null}>
                <AsyncNoAccessTooltip name={name!}>
                  <AccessSectionStyle>
                    <NoAccessLabel>
                      {
                        (text) => (
                          <AsyncLockCircleIcon label={text} />
                        ) /* safe to cast to string given there is no value binding */
                      }
                    </NoAccessLabel>
                  </AccessSectionStyle>
                </AsyncNoAccessTooltip>
              </React.Suspense>
            ) : null}
          </RowStyle>
        </MentionItemStyle>
      </MessagesIntlProvider>
    );
  }
}
