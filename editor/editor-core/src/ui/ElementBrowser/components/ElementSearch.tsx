import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Textfield from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { N200 } from '@atlaskit/theme/colors';
import { Shortcut } from '../../styles';
import { GRID_SIZE, SEARCH_ITEM_HEIGHT_WIDTH } from '../constants';
import useFocus from '../hooks/use-focus';
import { Modes } from '../types';

interface Props {
  onSearch: (value: string) => void;
  mode: keyof typeof Modes;
  focus: boolean;
  onClick: (e: React.MouseEvent) => void;
  searchTerm?: string;
}

function ElementSearch({
  onSearch,
  mode,
  intl: { formatMessage },
  focus,
  onClick,
  searchTerm,
}: Props & InjectedIntlProps): JSX.Element {
  const ref = useFocus(focus);

  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(value);
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {};
  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {};

  const getTheme = useCallback(
    (theme, props) => {
      const { container, input } = theme(props);
      return {
        container: {
          ...container,
          height: mode === Modes.full ? GRID_SIZE * 6 : GRID_SIZE * 5,
          borderRadius: GRID_SIZE,
          flex: mode === Modes.inline ? 'none' : '1 1 100%',
          ...(Modes.inline && { overflow: 'revert' }), // Needed for firefox, inherited property would hide the searchbar.
        },
        input: {
          ...input,
          marginBottom: Modes.inline ? 3 : 2,
          fontSize: Modes.inline ? 14 : GRID_SIZE * 2,
          padding: `${GRID_SIZE}px 6px ${GRID_SIZE}px 0`,
        },
      };
    },
    [mode],
  );
  return (
    <Textfield
      ref={ref}
      onChange={onChange}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      elemBeforeInput={
        <ElementBeforeInput data-testid="element_search__element_before_input">
          <SearchIcon
            size="medium"
            label="Advanced search"
            primaryColor="inherit"
          />
        </ElementBeforeInput>
      }
      elemAfterInput={
        <ElementAfterInput data-testid="element_search__element_after_input">
          <StyledShortcut>
            &#9166; {formatMessage(elementAfterInputMessage)}
          </StyledShortcut>
        </ElementAfterInput>
      }
      placeholder={formatMessage(placeHolderMessage)}
      aria-label="search"
      theme={getTheme}
      value={searchTerm}
    />
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

const StyledShortcut = styled(Shortcut)`
  padding: ${GRID_SIZE / 2}px ${GRID_SIZE}px;
  width: ${GRID_SIZE * 6}px;
`;

const ElementBeforeInput = styled.div`
  margin: 1px 6px 0 8px;
  color: ${N200};

  // Custom SearchIcon style
  span,
  svg {
    height: 20px;
    width: 20px;
  }
`;

const ElementAfterInput = styled.div`
  margin: 0 8px;
  height: ${SEARCH_ITEM_HEIGHT_WIDTH};
  text-align: center;
`;

const MemoizedElementSearchWithAnalytics = memo(
  withAnalyticsContext({
    component: 'Searchbar',
  })(injectIntl(ElementSearch)),
);

export default MemoizedElementSearchWithAnalytics;
