/** @jsx jsx */
import { forwardRef, Fragment } from 'react';
import { jsx } from '@emotion/react';
import { defineMessages, FormattedMessage } from 'react-intl-next';

import Spinner from '@atlaskit/spinner';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { LinkSearchListItemData } from '../../types';
import LinkSearchListItem from '../list-item';

import {
  listContainerStyles,
  spinnerContainerStyles,
  listStyles,
  listTitleStyles,
} from './styled';

import LinkSearchNoResults, {
  testIds as noResultsTestIds,
} from './link-search-no-results';

export const messages = defineMessages({
  titleRecentlyViewed: {
    id: 'fabric.linkPicker.listTitle.recentlyViewed',
    defaultMessage: 'Recently Viewed',
    description:
      'Describes type of items shown in the list for screen-reader users',
  },
  titleResults: {
    id: 'fabric.linkPicker.listTitle.results',
    defaultMessage: 'Results',
    description:
      'Describes type of items shown in the list for screen-reader users',
  },
  searchLinkResults: {
    id: 'fabric.linkPicker.hyperlink.searchLinkResults',
    defaultMessage:
      '{count, plural, =0 {no results} one {# result} other {# results}} found',
    description: 'Announce search results for screen-reader users.',
  },
});

export const testIds = {
  ...noResultsTestIds,
  resultListTitle: 'link-picker-list-title',
  searchResultItem: 'link-search-list-item',
  searchResultList: 'link-search-list',
  searchResultLoadingIndicator: 'link-picker.results-loading-indicator',
};

export interface LinkSearchListProps
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'onSelect' | 'onMouseEnter' | 'onMouseLeave'
  > {
  items?: LinkSearchListItemData[] | null;
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
  error?: unknown;
  hasSearchTerm?: boolean;
}

const LinkSearchList = forwardRef<HTMLDivElement, LinkSearchListProps>(
  (
    {
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
      hasSearchTerm,
      ...restProps
    },
    ref,
  ) => {
    let itemsContent;
    let loadingContent;

    const linkListTitle = hasSearchTerm
      ? messages.titleResults
      : messages.titleRecentlyViewed;

    if (items?.length === 0) {
      return <LinkSearchNoResults />;
    }

    if (items && items.length > 0) {
      itemsContent = (
        <Fragment>
          <div
            css={listTitleStyles}
            id={testIds.resultListTitle}
            data-testid={testIds.resultListTitle}
          >
            <FormattedMessage {...linkListTitle} />
          </div>
          <VisuallyHidden id="fabric.smartcard.linkpicker.suggested.results">
            {hasSearchTerm && (
              <FormattedMessage
                {...messages.searchLinkResults}
                values={{ count: items.length }}
                aria-live="polite"
                aria-atomic="true"
              />
            )}
          </VisuallyHidden>
          <ul
            id={id}
            role={role}
            css={listStyles}
            aria-controls="fabric.smartcard.linkpicker.suggested.results"
            aria-labelledby={testIds.resultListTitle}
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
        </Fragment>
      );
    }

    if (isLoading) {
      loadingContent = (
        <div css={spinnerContainerStyles}>
          <Spinner
            testId={testIds.searchResultLoadingIndicator}
            size="medium"
          />
        </div>
      );
    }

    return (
      <div ref={ref} css={listContainerStyles} {...restProps}>
        {itemsContent}
        {loadingContent}
      </div>
    );
  },
);

export default LinkSearchList;
