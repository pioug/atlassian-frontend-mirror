/** @jsx jsx */
import { Fragment } from 'react';
import { jsx } from '@emotion/react';
import { injectIntl, IntlShape, WrappedComponentProps } from 'react-intl-next';

import { LinkSearchListItemData, ListItemTimeStamp } from '../../types';
import { transformTimeStamp } from '../transformTimeStamp';
import {
  itemNameStyles,
  itemIconStyles,
  listItemContextStyles,
  listItemNameStyles,
  composeListItemStyles,
  imgStyles,
} from './styled';

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
  const container = item.container || null;
  const date = transformTimeStamp(
    intl,
    item.lastViewedDate,
    item.lastUpdatedDate,
  );

  return (
    <div
      css={composeListItemStyles(active, selected)}
      role={role}
      id={id}
      aria-selected={selected}
      data-testid="link-search-list-item"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleSelect}
    >
      <ListItemIcon item={item} intl={intl} />
      <div css={itemNameStyles}>
        <div data-testid="link-search-list-item-title" css={listItemNameStyles}>
          {item.name}
        </div>
        <div
          data-testid="link-search-list-item-subtitle"
          css={listItemContextStyles}
        >
          {container}
          {container && date && <Fragment>&nbsp; •&nbsp; </Fragment>}
          {date && <Fragment>{formatDate(date)}</Fragment>}
        </div>
      </div>
    </div>
  );
};

export default injectIntl(LinkSearchListItem);

const formatDate = (date: ListItemTimeStamp) => {
  return [date.pageAction, date.dateString, date.timeSince]
    .filter(Boolean)
    .join(' ');
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
      <span css={itemIconStyles}>
        <Glyph alt={alt} />
      </span>
    );
  }

  return (
    <span css={itemIconStyles}>
      <img src={icon} alt={alt} css={imgStyles} />
    </span>
  );
};
