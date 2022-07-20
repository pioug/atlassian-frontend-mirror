/** @jsx jsx */
import { PureComponent } from 'react';
import { jsx } from '@emotion/react';
import Spinner from '@atlaskit/spinner';

import { LinkSearchListItemData } from '../../types';
import LinkSearchListItem from '../list-item';
import {
  listContainerStyles,
  spinnerContainerStyles,
  listStyles,
} from './styled';

export interface Props {
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

export default class LinkSearchList extends PureComponent<Props, {}> {
  render() {
    const {
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
    } = this.props;

    let itemsContent;
    let loadingContent;

    if (items && items.length > 0) {
      itemsContent = (
        <ul
          data-testid="link-search-list"
          css={listStyles}
          id={id}
          role={role}
          aria-controls={ariaControls}
          aria-labelledby={ariaLabelledBy}
        >
          {items.map((item, index) => (
            <LinkSearchListItem
              id={`link-search-list-item-${index}`}
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
          <Spinner
            testId="link-picker.results-loading-indicator"
            size="medium"
          />
        </div>
      );
    }

    return (
      <div css={listContainerStyles}>
        {itemsContent}
        {loadingContent}
      </div>
    );
  }
}
