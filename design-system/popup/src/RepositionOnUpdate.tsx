import React, { FC, Fragment, useLayoutEffect, useRef } from 'react';

import { RepositionOnUpdateProps } from './types';

export const RepositionOnUpdate: FC<RepositionOnUpdateProps> = ({
  children,
  update,
}) => {
  // Ref used here to skip update on first render (when refs haven't been set)
  const isFirstRenderRef = useRef<boolean>(true);

  useLayoutEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      return;
    }
    // callback function from popper that repositions pop-up on content Update
    update();
  }, [update]);

  // wrapping in fragment to make TS happy (known issue with FC returning children)
  return <Fragment>{children}</Fragment>;
};
