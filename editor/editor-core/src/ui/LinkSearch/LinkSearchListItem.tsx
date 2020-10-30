import React from 'react';
import { HTMLAttributes, ComponentClass } from 'react';
import styled from 'styled-components';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { fontSizeSmall } from '@atlaskit/theme';
import { N20, N800, N100 } from '@atlaskit/theme/colors';
import { LinkSearchListItemData } from './types';
import distanceInWords from 'date-fns/distance_in_words';
import differenceInCalendarDays from 'date-fns/difference_in_calendar_days';
import format from 'date-fns/format';

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
  font-size: ${fontSizeSmall()}px;
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
  onMouseMove: (objectId: string) => void;
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
    onMouseMove(item.objectId);
  };

  private renderIcon() {
    const {
      item: { icon, iconUrl },
    } = this.props;
    if (icon) {
      return <Icon>{icon}</Icon>;
    }
    if (iconUrl) {
      return (
        <Icon>
          <img src={iconUrl} />
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
        format(timeStamp, 'MMMM DD, YYYY'),
      );
    }
    return this.renderWithSpaces(
      pageActionText,
      distanceInWords(timeStamp, Date.now()),
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
