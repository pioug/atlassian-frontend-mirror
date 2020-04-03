import React, { FC, Fragment, useLayoutEffect } from 'react';
import { RepositionOnUpdateProps } from './types';

export const RepositionOnUpdate: FC<RepositionOnUpdateProps> = ({
  children,
  scheduleUpdate,
  content,
}) => {
  useLayoutEffect(() => {
    // callback function from popper that repositions pop-up on content Update
    scheduleUpdate();
  }, [content, scheduleUpdate]);
  // wrapping in fragment to make TS happy (known issue with FC returning children)
  return <Fragment>{children}</Fragment>;
};
