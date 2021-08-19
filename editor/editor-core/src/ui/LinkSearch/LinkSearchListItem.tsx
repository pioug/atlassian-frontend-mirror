import React from 'react';
import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { fontSizeSmall } from '@atlaskit/theme';
import { N20, N800, N100 } from '@atlaskit/theme/colors';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { LinkSearchListItemData } from './types';
import formatDistance from 'date-fns/formatDistance';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';
import format from 'date-fns/format';
import { getCorrectAltByIconUrl } from './listItemAlts';

import { injectIntl, InjectedIntlProps } from 'react-intl';
import messages from '../../messages';

interface ContainerProps {
  selected: boolean;
}

export const Container = styled.li`
  background-color: ${(props: ContainerProps) =>
    props.selected ? N20 : 'transparent'};
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  margin-top: 0;
`;

const NameWrapper: ComponentClass<HTMLAttributes<{}>> = styled.span`
  overflow: hidden;
`;

export const Name: ComponentClass<HTMLAttributes<{}>> = styled.div`
  color: ${N800};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 20px;
`;

export const ContainerName: ComponentClass<React.HTMLAttributes<{}>> = styled.div`
  color: ${N100};
  line-height: 14px;
  font-size: ${relativeFontSizeToBase16(fontSizeSmall())};
`;

const Icon: ComponentClass<HTMLAttributes<{}>> = styled.span`
  min-width: 16px;
  margin-top: 3px;
  margin-right: 12px;

  img {
    max-width: 16px;
  }
`;

export interface Props {
  item: LinkSearchListItemData;
  selected: boolean;
  onSelect: (href: string, text: string) => void;
  onMouseMove?: (objectId: string) => void;
  onMouseEnter?: (objectId: string) => void;
  onMouseLeave?: (objectId: string) => void;
}

class LinkSearchListItem extends React.PureComponent<
  Props & InjectedIntlProps,
  {}
> {
  handleSelect = (e: React.MouseEvent) => {
    e.preventDefault(); // don't let editor lose focus
    const { item, onSelect } = this.props;
    onSelect(item.url, item.name);
  };

  handleMouseMove = () => {
    const { onMouseMove, item } = this.props;
    onMouseMove && onMouseMove(item.objectId);
  };

  handleMouseEnter = () => {
    const { onMouseEnter, item } = this.props;
    onMouseEnter && onMouseEnter(item.objectId);
  };

  handleMouseLeave = () => {
    const { onMouseLeave, item } = this.props;
    onMouseLeave && onMouseLeave(item.objectId);
  };

  private renderIcon() {
    const {
      item: { icon, iconUrl },
      intl,
    } = this.props;
    if (icon) {
      return <Icon>{icon}</Icon>;
    }
    if (iconUrl) {
      return (
        <Icon>
          {/*
            - getCorrectAltByIconUrl
            Workaround to get alt text for images from url
            Can be removed when alt={iconAlt} will be available from GraphQL
            More details: https://a11y-internal.atlassian.net/browse/AK-811
          */}
          <img src={iconUrl} alt={getCorrectAltByIconUrl(iconUrl, intl)} />
        </Icon>
      );
    }
    return null;
  }

  renderWithSpaces(
    pageAction: string,
    dateString: string,
    timeSince: string = '',
  ) {
    return (
      <>
        &nbsp; •
        <span
          className="link-search-timestamp"
          data-test-id="link-search-timestamp"
        >
          &nbsp; {pageAction} {dateString} {timeSince}
        </span>
      </>
    );
  }

  renderAbsoluteOrRelativeDate(
    timeStamp: Date,
    pageAction: 'updated' | 'viewed',
  ) {
    const { intl } = this.props;

    let pageActionText: string = '';
    switch (pageAction) {
      case 'updated':
        pageActionText = intl.formatMessage(messages.timeUpdated);
        break;
      case 'viewed':
        pageActionText = intl.formatMessage(messages.timeViewed);
        break;
    }

    if (differenceInCalendarDays(timeStamp, Date.now()) < -7) {
      return this.renderWithSpaces(
        pageActionText,
        format(timeStamp, 'MMMM dd, yyyy'),
      );
    }
    return this.renderWithSpaces(
      pageActionText,
      formatDistance(timeStamp, Date.now()),
      intl.formatMessage(messages.timeAgo),
    );
  }

  renderTimeStamp() {
    const { lastUpdatedDate, lastViewedDate } = this.props.item;
    if (lastViewedDate) {
      return this.renderAbsoluteOrRelativeDate(lastViewedDate, 'viewed');
    }
    if (lastUpdatedDate) {
      return this.renderAbsoluteOrRelativeDate(lastUpdatedDate, 'updated');
    }
  }

  render() {
    const { item, selected } = this.props;
    return (
      <Container
        data-testid="link-search-list-item"
        selected={selected}
        onMouseMove={this.handleMouseMove}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        onClick={this.handleSelect}
      >
        {this.renderIcon()}
        <NameWrapper>
          <Name>{item.name}</Name>
          <ContainerName>
            {item.container}
            {this.renderTimeStamp()}
          </ContainerName>
        </NameWrapper>
      </Container>
    );
  }
}

export default injectIntl(LinkSearchListItem);
