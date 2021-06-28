import React, { memo } from 'react';
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
import { relativeFontSizeToBase16 } from '@atlaskit/editor-shared-styles';

interface Props {
  onSearch: (value: string) => void;
  mode: keyof typeof Modes;
  focus: boolean;
  onClick: (e: React.MouseEvent) => void;
  searchTerm?: string;
}
interface WrapperProps {
  mode: keyof typeof Modes;
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
  return (
    <Wrapper mode={mode}>
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
        value={searchTerm}
      />
    </Wrapper>
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

const Wrapper = styled.div<WrapperProps>`
  & > [data-ds--text-field--container] {
    height: ${(props) =>
      props.mode === Modes.full ? GRID_SIZE * 6 : GRID_SIZE * 5}px;
    border-radius: ${GRID_SIZE}px;
    flex: ${(props) => (props.mode === Modes.inline ? 'none' : '1 1 100%')};
    overflow: ${Modes.inline ? 'revert' : 'visible'};
    & > [data-ds--text-field--input] {
      margin-bottom: ${Modes.inline ? 3 : 2}px;
      font-size: ${Modes.inline
        ? relativeFontSizeToBase16(14)
        : relativeFontSizeToBase16(GRID_SIZE * 2)};
      padding: ${GRID_SIZE}px 6px ${GRID_SIZE}px 0;
    }
  }
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
