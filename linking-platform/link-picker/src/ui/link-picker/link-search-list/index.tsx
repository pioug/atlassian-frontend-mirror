/** @jsx jsx */
import {
  forwardRef,
  Fragment,
  KeyboardEvent,
  useCallback,
  useRef,
} from 'react';
import { jsx } from '@emotion/react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { defineMessages, FormattedMessage } from 'react-intl-next';

import Spinner from '@atlaskit/spinner';
import VisuallyHidden from '@atlaskit/visually-hidden';

import { LinkPickerPlugin, LinkSearchListItemData } from '../../types';
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
import { useTrackResultsShown } from './use-track-results-shown';
import { handleNavKeyDown } from '../utils';
import { emptyStateNoResultsWrapper } from './link-search-no-results/styled';

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
  tabsLoadingIndicator: 'link-picker.tabs-loading-indicator',
};

type LinkSearchListElement = HTMLElement;

export interface LinkSearchListProps
  extends Omit<
    React.HTMLAttributes<LinkSearchListElement>,
    'onSelect' | 'onChange'
  > {
  items?: LinkSearchListItemData[] | null;
  isLoading: boolean;
  selectedIndex: number;
  activeIndex: number;
  onChange: (objectId: string) => void;
  onSelect: (objectId: string) => void;
  onKeyDown?: (e: KeyboardEvent<LinkSearchListElement>) => void;
  ariaControls?: string;
  ariaLabelledBy?: string;
  role?: string;
  id?: string;
  hasSearchTerm?: boolean;
  activePlugin?: LinkPickerPlugin;
}

const LinkSearchList = forwardRef<HTMLDivElement, LinkSearchListProps>(
  (
    {
      onChange,
      onSelect,
      onKeyDown,
      items,
      activeIndex,
      selectedIndex,
      isLoading,
      ariaControls,
      ariaLabelledBy,
      role,
      id,
      hasSearchTerm,
      activePlugin,
      ...restProps
    },
    ref,
  ) => {
    let itemsContent;
    let loadingContent;

    const linkListTitle = hasSearchTerm
      ? messages.titleResults
      : messages.titleRecentlyViewed;

    useTrackResultsShown(isLoading, items, hasSearchTerm);

    const itemRefs = useRef<Record<string, HTMLElement>>({});
    const itemRefCallback = useCallback(
      (el: HTMLElement | null, id: string) => {
        if (el === null) {
          delete itemRefs.current[id];
        } else {
          itemRefs.current[id] = el;
        }
      },
      [],
    );

    const getTabIndex = useCallback(
      (index: number) => {
        if (selectedIndex > -1) {
          return selectedIndex === index ? 0 : -1;
        }
        if (index === 0) {
          return 0;
        }
        return -1;
      },
      [selectedIndex],
    );

    const handleOnFocus = () => {
      if (items && items.length > 0 && selectedIndex === -1) {
        const item = items[0];
        onChange(item.objectId);
      }
    };

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLElement>) => {
        let updatedIndex = activeIndex;
        if (onKeyDown) {
          onKeyDown(event);
        }

        if (!items?.length) {
          return;
        }
        updatedIndex = handleNavKeyDown(event, items.length, activeIndex);

        const item = items?.[updatedIndex];

        if (
          ['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key) &&
          item
        ) {
          onChange(item.objectId);
          if (itemRefs.current) {
            itemRefs.current[item.objectId]?.focus();
          }
        }
      },
      [activeIndex, items, onChange, onKeyDown],
    );

    if (items?.length === 0) {
      if (
        getBooleanFF('platform.linking-platform.link-picker.enable-empty-state')
      ) {
        if (hasSearchTerm) {
          return <LinkSearchNoResults />;
        } else {
          return (
            <div css={emptyStateNoResultsWrapper}>
              {activePlugin?.emptyStateNoResults
                ? activePlugin.emptyStateNoResults()
                : null}
            </div>
          );
        }
      } else {
        return <LinkSearchNoResults />;
      }
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
                onFocus={handleOnFocus}
                onKeyDown={handleKeyDown}
                onSelect={onSelect}
                key={item.objectId}
                tabIndex={getTabIndex(index)}
                ref={el => itemRefCallback(el, item.objectId)}
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
