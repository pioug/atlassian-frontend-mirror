/** @jsx jsx */
import { forwardRef, Fragment, KeyboardEvent } from 'react';
import { jsx } from '@emotion/react';
import { IntlShape } from 'react-intl-next';

import { LinkSearchListItemData, ListItemTimeStamp } from '../../types';
import { transformTimeStamp } from '../transformTimeStamp';
import {
  itemNameStyles,
  itemIconStyles,
  listItemContextStyles,
  listItemNameStyles,
  composeListItemStyles,
  imgStyles,
  listItemContainerStyles,
  listItemContainerInnerStyles,
} from './styled';
import { testIds } from '..';
import { useIntl } from 'react-intl-next';

export interface Props {
  item: LinkSearchListItemData;
  selected: boolean;
  active: boolean;
  tabIndex?: number;
  onSelect: (objectId: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  onFocus: () => void;
  id?: string;
  role?: string;
}

type LinkSearchListItemProps = Props;

const LinkSearchListItem = forwardRef<HTMLDivElement, LinkSearchListItemProps>(
  (
    {
      item,
      selected,
      active,
      id,
      role,
      onSelect,
      tabIndex,
      onKeyDown,
      onFocus,
    },
    ref,
  ) => {
    const intl = useIntl();
    const handleSelect = () => onSelect(item.objectId);
    const container = item.container || null;
    const date = transformTimeStamp(
      intl,
      item.lastViewedDate,
      item.lastUpdatedDate,
    );

    return (
      <div
        css={composeListItemStyles(selected)}
        role={role}
        id={id}
        aria-selected={selected}
        data-testid={testIds.searchResultItem}
        onKeyDown={onKeyDown}
        onClick={handleSelect}
        onFocus={onFocus}
        tabIndex={tabIndex}
        ref={ref}
      >
        <ListItemIcon item={item} intl={intl} />
        <div css={itemNameStyles}>
          <div
            data-testid={`${testIds.searchResultItem}-title`}
            css={listItemNameStyles}
          >
            {item.name}
          </div>
          <div
            data-testid={`${testIds.searchResultItem}-subtitle`}
            css={listItemContextStyles}
          >
            {container && (
              <div css={listItemContainerStyles}>
                <span css={listItemContainerInnerStyles}>{container}</span>
              </div>
            )}
            {date && (
              <div css={listItemContainerInnerStyles}>
                {container && <Fragment>&nbsp; •&nbsp; </Fragment>}
                <Fragment>{formatDate(date)}</Fragment>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);

export default LinkSearchListItem;

const formatDate = (date: ListItemTimeStamp) => {
  return [date.pageAction, date.dateString, date.timeSince]
    .filter(Boolean)
    .join(' ');
};

const isSVG = (icon: string) =>
  icon.startsWith('<svg') && icon.endsWith('</svg>');

const base64SVG = (icon: string) =>
  `data:image/svg+xml;base64,${Buffer.from(icon).toString('base64')}`;

const testId = 'link-search-list-item-icon';

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
        <Glyph alt={alt} data-testid={testId} />
      </span>
    );
  }
  return (
    <span css={itemIconStyles}>
      <img
        data-testid={testId}
        src={isSVG(icon) ? base64SVG(icon) : icon}
        alt={alt}
        css={imgStyles}
      />
    </span>
  );
};
