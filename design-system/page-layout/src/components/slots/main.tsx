/** @jsx jsx */
import { useEffect } from 'react';

import { jsx } from '@emotion/core';

import { MAIN_SELECTOR } from '../../common/constants';
import { SlotWidthProps } from '../../common/types';
import { useSkipLinks } from '../../controllers';

import { mainStyles } from './styles';

const mainSelector = {
  [MAIN_SELECTOR]: 'true',
};
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
    <div data-testid={testId} {...mainSelector} css={mainStyles} id={id}>
      {children}
    </div>
  );
};

export default Main;
