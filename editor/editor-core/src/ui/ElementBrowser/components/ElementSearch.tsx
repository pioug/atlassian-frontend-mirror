import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import Textfield from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import { N200 } from '@atlaskit/theme/colors';
import { Shortcut } from '../../styles';
import {
  GRID_SIZE,
  SEARCH_ITEM_HEIGHT_WIDTH,
  SEARCH_ITEM_MARGIN,
} from '../constants';
import { Modes } from '../types';

interface Props {
  onSearch: (value: string) => void;
  mode: keyof typeof Modes;
}

function ElementSearch({
  onSearch = () => {},
  mode,
  intl: { formatMessage },
}: Props & InjectedIntlProps): JSX.Element {
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
          flex: mode === Modes.inline ? 0 : '1 1 100%',
        },
        input,
      };
    },
    [mode],
  );
  return (
    <Textfield
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      elemBeforeInput={
        <ElementBeforeInput>
          <SearchIcon
            size="medium"
            label="Advanced search"
            primaryColor="inherit"
          />
        </ElementBeforeInput>
      }
      elemAfterInput={
        <ElementAfterInput>
          <StyledShortcut>/</StyledShortcut>
        </ElementAfterInput>
      }
      placeholder={formatMessage(placeHolderMessage)}
      aria-label="search"
      theme={getTheme}
    />
  );
}

const placeHolderMessage = {
  id: 'fabric.editor.elementbrowser.searchbar.placeholder',
  defaultMessage: 'Type to insert',
  description: 'Search placeholder',
};

const StyledShortcut = styled(Shortcut)`
  padding: ${GRID_SIZE / 2}px ${GRID_SIZE}px;
`;

const ElementBeforeInput = styled.div`
  margin: 0 ${SEARCH_ITEM_MARGIN};
  color: ${N200};
`;

const ElementAfterInput = styled.div`
  margin: 0 ${SEARCH_ITEM_MARGIN};
  height: ${SEARCH_ITEM_HEIGHT_WIDTH};
  width: ${SEARCH_ITEM_HEIGHT_WIDTH};
  text-align: center;
`;

const MemoizedElementSearchWithAnalytics = memo(
  withAnalyticsContext({
    component: 'search-textfield',
  })(injectIntl(ElementSearch)),
);

export default MemoizedElementSearchWithAnalytics;
