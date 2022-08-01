/** @jsx jsx */
import { jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';

import { LinkSearchListItemData } from '../../types';
import LinkSearchListItem from '../list-item';
import {
  listContainerStyles,
  spinnerContainerStyles,
  listStyles,
} from './styled';
import { testIds } from '../';

export interface LinkSearchListProps {
  items?: LinkSearchListItemData[];
  isLoading: boolean;
  selectedIndex: number;
  activeIndex: number;
  onSelect: (objectId: string) => void;
  onMouseEnter: (objectId: string) => void;
  onMouseLeave: (objectId: string) => void;
  ariaControls?: string;
  ariaLabelledBy?: string;
  role?: string;
  id?: string;
}

const LinkSearchList = ({
  onSelect,
  onMouseEnter,
  onMouseLeave,
  items,
  activeIndex,
  selectedIndex,
  isLoading,
  ariaControls,
  ariaLabelledBy,
  role,
  id,
}: LinkSearchListProps) => {
  let itemsContent;
  let loadingContent;

  if (items && items.length > 0) {
    itemsContent = (
      <ul
        id={id}
        role={role}
        css={listStyles}
        aria-controls={ariaControls}
        aria-labelledby={ariaLabelledBy}
        data-testid={testIds.searchResultList}
      >
        {items.map((item, index) => (
          <LinkSearchListItem
            id={`${testIds.searchResultItem}-${index}`}
            role={role && 'option'}
            item={item}
            selected={selectedIndex === index}
            active={activeIndex === index}
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
      <div css={spinnerContainerStyles}>
        <Spinner testId={testIds.searchResultLoadingIndicator} size="medium" />
      </div>
    );
  }

  return (
    <div css={listContainerStyles}>
      {itemsContent}
      {loadingContent}
    </div>
  );
};

export default LinkSearchList;
