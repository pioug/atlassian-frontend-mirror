/** @jsx jsx */
import { jsx } from '@emotion/core';

import { SlotWidthProps } from '../../common/types';
import { getPageLayoutSlotSelector } from '../../common/utils';
import { useSkipLink } from '../../controllers';

import { mainStyles } from './styles';

const Main = (props: SlotWidthProps) => {
  const { children, testId, id, skipLinkTitle } = props;

  useSkipLink(id, skipLinkTitle);

  return (
    <div
      data-testid={testId}
      css={mainStyles}
      id={id}
      {...getPageLayoutSlotSelector('main')}
    >
      {children}
    </div>
  );
};

export default Main;
