/** @jsx jsx */
import { Fragment } from 'react';
import { jsx } from '@emotion/core';
import { injectIntl, IntlShape, WrappedComponentProps } from 'react-intl-next';

import { LinkSearchListItemData, ListItemTimeStamp } from '../types';
import { transformTimeStamp } from '../transformTimeStamp';
import {
  ItemNameWrapper,
  ItemIconWrapper,
  ListItemContext,
  ListItemName,
  ListItemWrapper,
  ImgStyles,
} from '../styles';

export interface Props {
  item: LinkSearchListItemData;
  selected: boolean;
  active: boolean;
  onSelect: (objectId: string) => void;
  onMouseEnter: (objectId: string) => void;
  onMouseLeave: (objectId: string) => void;
  id?: string;
  role?: string;
}

type LinkSearchListItemProps = WrappedComponentProps & Props;

const LinkSearchListItem = ({
  item,
  selected,
  active,
  id,
  role,
  intl,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: LinkSearchListItemProps) => {
  const handleSelect = () => onSelect(item.objectId);
  const handleMouseEnter = () => onMouseEnter(item.objectId);
  const handleMouseLeave = () => onMouseLeave(item.objectId);

  return (
    <ListItemWrapper
      role={role}
      id={id}
      aria-selected={selected}
      data-testid="link-search-list-item"
      selected={selected}
      active={active}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleSelect}
    >
      <ListItemIcon item={item} intl={intl} />
      <ItemNameWrapper>
        <ListItemName>{item.name}</ListItemName>
        <ListItemContext>
          {item.container}
          <ItemTimeStamp
            date={transformTimeStamp(
              intl,
              item.lastViewedDate,
              item.lastUpdatedDate,
            )}
          />
        </ListItemContext>
      </ItemNameWrapper>
    </ListItemWrapper>
  );
};

export default injectIntl(LinkSearchListItem);

const ItemTimeStamp = (props: { date: ListItemTimeStamp | undefined }) => {
  const { date } = props;

  if (!date) {
    return null;
  }

  return (
    <Fragment>
      &nbsp; •
      <span
        className="link-search-timestamp"
        data-test-id="link-search-timestamp"
      >
        &nbsp; {date.pageAction} {date.dateString} {date.timeSince || ''}
      </span>
    </Fragment>
  );
};

const ListItemIcon = (props: {
  item: LinkSearchListItemData;
  intl: IntlShape;
}) => {
  const { item, intl } = props;
  const { icon, iconAlt } = item;
  if (!icon) {
    return null;
  }

  const alt =
    typeof iconAlt === 'string' ? iconAlt : intl.formatMessage(iconAlt);

  if (typeof icon !== 'string') {
    const Glyph = icon;

    return (
      <ItemIconWrapper>
        <Glyph alt={alt} />
      </ItemIconWrapper>
    );
  }

  return (
    <ItemIconWrapper>
      <img src={icon} alt={alt} css={ImgStyles} />
    </ItemIconWrapper>
  );
};
