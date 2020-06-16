/** @jsx jsx */
import { jsx } from '@emotion/core';

import { MAIN_SELECTOR } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';

import { mainStyles } from './styles';

const mainSelector = {
  [MAIN_SELECTOR]: 'true',
};
const Main = (props: SlotWidthProps) => {
  const { children, testId } = props;

  return (
    <div data-testid={testId} {...mainSelector} css={mainStyles}>
      {children}
    </div>
  );
};

export default Main;
