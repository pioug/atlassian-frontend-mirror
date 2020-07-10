/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { SlotWidthProps } from '../../common/types';
import { getPageLayoutSlotSelector } from '../../common/utils';
import { useSkipLinks } from '../../controllers';

import { mainStyles } from './styles';

const Main = (props: SlotWidthProps) => {
  const { children, testId, id, skipLinkTitle } = props;
  const { registerSkipLink, unregisterSkipLink } = useSkipLinks();

  useEffect(() => {
    return () => {
      unregisterSkipLink(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (id && skipLinkTitle) {
    registerSkipLink({ id, skipLinkTitle });
  }

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
