import React, { FC, Fragment, useLayoutEffect } from 'react';

import { RepositionOnUpdateProps } from './types';

export const RepositionOnUpdate: FC<RepositionOnUpdateProps> = ({
  children,
  update,
  content,
}) => {
  useLayoutEffect(() => {
    // callback function from popper that repositions pop-up on content Update
    update();
  }, [content, update]);
  // wrapping in fragment to make TS happy (known issue with FC returning children)
  return <Fragment>{children}</Fragment>;
};
