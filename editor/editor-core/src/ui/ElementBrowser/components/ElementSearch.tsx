/** @jsx jsx */
import React, { memo } from 'react';
import { css, jsx } from '@emotion/react';
import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';
import Textfield from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { token } from '@atlaskit/tokens';
import { N200 } from '@atlaskit/theme/colors';
import { shortcutStyle } from '../../styles';
import { GRID_SIZE, SEARCH_ITEM_HEIGHT_WIDTH } from '../constants';
import useFocus from '../hooks/use-focus';
import { Modes } from '../types';
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

interface Props {
  onSearch: (value: string) => void;
  mode: keyof typeof Modes;
  focus: boolean;
  onClick: (e: React.MouseEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  searchTerm?: string;
}

function ElementSearch({
  onSearch,
  mode,
  intl: { formatMessage },
  focus,
  onClick,
  onKeyDown,
  searchTerm,
}: Props & WrappedComponentProps): JSX.Element {
  const ref = useFocus(focus);

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(value);
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {};
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {};
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
              &#9166; {formatMessage(elementAfterInputMessage)}
            </div>
          </div>
        }
        placeholder={formatMessage(placeHolderMessage)}
        aria-label="search"
        value={searchTerm}
      />
    </div>
  );
}

const elementAfterInputMessage = {
  id: 'fabric.editor.elementbrowser.searchbar.elementAfterInput',
  defaultMessage: 'Enter',
  description: 'Enter to insert',
};

const placeHolderMessage = {
  id: 'fabric.editor.elementbrowser.searchbar.placeholder',
  defaultMessage: 'Search',
  description: 'Search field placeholder',
};

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
