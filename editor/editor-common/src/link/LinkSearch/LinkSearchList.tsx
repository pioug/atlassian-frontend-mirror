/** @jsx jsx */
import { PureComponent } from 'react';

import { css, jsx } from '@emotion/react';

import Spinner from '@atlaskit/spinner';
import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import LinkSearchListItem from './LinkSearchListItem';
import type { LinkSearchListItemData } from './types';

const listContainer = css({
  paddingTop: 0,
  marginTop: token('space.150', '12px'),
  borderTop: `1px solid ${token('color.border', N30)}`,
});

const spinnerContainer = css({
  textAlign: 'center',
  minHeight: '80px',
  marginTop: token('space.400', '32px'),
});

export const linkSearchList = css({
  padding: 0,
  listStyle: 'none',
});

export interface Props {
  items?: LinkSearchListItemData[];
  isLoading: boolean;
  selectedIndex: number;
  onSelect: (href: string, text: string) => void;
  onMouseMove?: (objectId: string) => void;
  onMouseEnter?: (objectId: string) => void;
  onMouseLeave?: (objectId: string) => void;
  ariaControls?: string;
  role?: string;
  id?: string;
}

export default class LinkSearchList extends PureComponent<Props, {}> {
  render() {
    const {
      onSelect,
      onMouseMove,
      onMouseEnter,
      onMouseLeave,
      items,
      selectedIndex,
      isLoading,
      ariaControls,
      role,
      id,
    } = this.props;

    let itemsContent;
    let loadingContent;

    if (items && items.length > 0) {
      itemsContent = (
        <ul
          css={linkSearchList}
          id={id}
          role={role}
          aria-controls={ariaControls}
        >
          {items.map((item, index) => (
            <LinkSearchListItem
              id={`link-search-list-item-${index}`}
              role={role && 'option'}
              item={item}
              selected={selectedIndex === index}
              onMouseMove={onMouseMove}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              onSelect={onSelect}
              key={item.objectId}
            />
          ))}
        </ul>
      );
    }

    if (isLoading) {
      loadingContent = (
        <div data-testid={`${id}-loading`} css={spinnerContainer}>
          <Spinner size="medium" />
        </div>
      );
    }

    return (
      <div css={listContainer}>
        {itemsContent}
        {loadingContent}
      </div>
    );
  }
}
