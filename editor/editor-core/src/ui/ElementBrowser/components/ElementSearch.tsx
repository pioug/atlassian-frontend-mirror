import React, { memo } from 'react';
import styled from 'styled-components';
import Textfield from '@atlaskit/textfield';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { withAnalyticsContext } from '@atlaskit/analytics-next';
import UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
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

const ElementSearch = ({ onSearch = () => {}, mode }: Props): JSX.Element => {
  const onChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(value);
  };
  const onFocus = (
    e: React.FocusEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    analyticsEvent.fire();
  };
  const onBlur = (
    e: React.FocusEvent<HTMLInputElement>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    analyticsEvent.fire();
  };

  const searchStyle = {
    height: mode === Modes.full ? GRID_SIZE * 6 : GRID_SIZE * 5,
    borderRadius: mode === Modes.full ? GRID_SIZE : GRID_SIZE / 2,
  };
  return (
    <Textfield
      onChange={onChange}
      // @ts-ignore
      onFocus={onFocus}
      // @ts-ignore
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
      placeholder="Type to insert"
      aria-label="search"
      style={searchStyle}
    />
  );
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
  })(ElementSearch),
);

export default MemoizedElementSearchWithAnalytics;
