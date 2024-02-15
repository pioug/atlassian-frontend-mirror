/** @jsx jsx */
import React, { memo, useLayoutEffect, useRef } from 'react';

import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';
import { shortcutStyle } from '@atlaskit/editor-shared-styles/shortcut';
import SearchIcon from '@atlaskit/icon/glyph/search';
import Textfield from '@atlaskit/textfield';
import { N200 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

import type { QuickInsertItem } from '../../provider-factory';
import { GRID_SIZE, SEARCH_ITEM_HEIGHT_WIDTH } from '../constants';
import useFocus from '../hooks/use-focus';
import commonMessages from '../messages';
import { Modes } from '../types';

interface Props {
  onSearch: (value: string) => void;
  mode: keyof typeof Modes;
  focus: boolean;
  onClick: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  searchTerm?: string;
  items: QuickInsertItem[];
}

function ElementSearch({
  onSearch,
  mode,
  intl: { formatMessage },
  focus,
  onClick,
  onKeyDown,
  searchTerm,
  items,
}: Props & WrappedComponentProps): JSX.Element {
  const ref = useFocus(focus);
  const assistiveTextRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (assistiveTextRef) {
      const assistiveDiv = assistiveTextRef.current;
      /**
       * We need to remove and set attributes, for the proper working of screen readers.
       */
      assistiveDiv?.removeAttribute('aria-live');
      assistiveDiv?.setAttribute('aria-live', 'polite');
    }
  }, [items, formatMessage]);

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(value);
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {};
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {};

  const getFormattedMessage = (itemsCount: number): string => {
    if (searchTerm === '') {
      return `${itemsCount} ${formatMessage(
        commonMessages.assistiveTextSuggestionsDefault,
      )}`;
    }
    if (itemsCount > 1) {
      return `${itemsCount} ${formatMessage(
        commonMessages.assistiveTextSuggestions,
      )}`;
    }
    if (itemsCount === 1) {
      return `${itemsCount} ${formatMessage(
        commonMessages.assistiveTextSuggestion,
      )}`;
    }
    return formatMessage(commonMessages.assistiveTextSuggestionNothing);
  };

  const assistiveMessage = getFormattedMessage(items?.length);

  return (
    <div css={[wrapper, mode === Modes.inline && wrapperInline]}>
      <Textfield
        ref={ref}
        onChange={onChange}
        onClick={onClick}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onBlur={onBlur}
        elemBeforeInput={
          <div
            css={elementBeforeInput}
            data-testid="element_search__element_before_input"
          >
            <SearchIcon
              size="medium"
              label="Advanced search"
              primaryColor="inherit"
            />
          </div>
        }
        elemAfterInput={
          <div
            css={elementAfterInput}
            data-testid="element_search__element_after_input"
          >
            <div css={styledShortcut}>
              &#9166; {formatMessage(commonMessages.elementAfterInputMessage)}
            </div>
          </div>
        }
        placeholder={formatMessage(commonMessages.placeHolderMessage)}
        aria-label="search"
        aria-labelledby="search-assistive"
        className="js-search-input"
        value={searchTerm}
      />
      <span
        id="search-assistive"
        ref={assistiveTextRef}
        aria-live="polite"
        aria-atomic="true"
        className="assistive"
      >
        {assistiveMessage}
      </span>
    </div>
  );
}

const styledShortcut = css`
  ${shortcutStyle}
  padding: ${GRID_SIZE / 2}px ${GRID_SIZE}px;
  width: ${GRID_SIZE * 6}px;
`;

const wrapper = css`
  & > [data-ds--text-field--container] {
    height: ${GRID_SIZE * 6}px;
    border-radius: ${GRID_SIZE}px;
    flex: 1 1 100%;
    overflow: visible;
    & > [data-ds--text-field--input] {
      margin-bottom: 3px;
      font-size: ${relativeFontSizeToBase16(14)};
      padding: ${GRID_SIZE}px ${token('space.075', '6px')} ${GRID_SIZE}px 0;
    }
  }
`;

const wrapperInline = css`
  & > [data-ds--text-field--container] {
    height: ${GRID_SIZE * 5}px;
    flex: none;
    overflow: revert;
  }
`;

const elementBeforeInput = css`
  margin: 1px ${token('space.075', '6px')} 0 ${token('space.100', '8px')};
  color: ${token('color.icon', N200)};

  // Custom SearchIcon style
  span,
  svg {
    height: 20px;
    width: 20px;
  }
`;

const elementAfterInput = css`
  margin: 0 ${token('space.100', '8px')};
  height: ${SEARCH_ITEM_HEIGHT_WIDTH};
  text-align: center;
`;

const MemoizedElementSearchWithAnalytics = memo(
  withAnalyticsContext({
    component: 'Searchbar',
  })(injectIntl(ElementSearch)),
);

export default MemoizedElementSearchWithAnalytics;
