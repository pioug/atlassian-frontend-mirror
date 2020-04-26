/** @jsx jsx */
import { jsx } from '@emotion/core';
import React from 'react';
import { gs } from '../utils';

export interface IconProps {
  /* Url of the icon to be displayed. Note that this is only used if a JSX element is not provided */
  url?: string;
  /* Element to be displayed as an icon. We naively render this if it is provided. Allows us to pass in AK icons */
  icon?: React.ReactNode;
}

export const Icon = ({ url, icon }: IconProps) => {
  return (
    <span
      css={{
        height: gs(2.5),
        width: gs(2),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon || <img css={{ height: gs(2), width: gs(2) }} src={url} />}
    </span>
  );
};
