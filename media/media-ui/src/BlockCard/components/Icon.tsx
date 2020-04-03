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

// TODO type this more strictly so it's either got an icon, or it has a url and a tooltip
export const Icon = ({ url, icon }: IconProps) =>
  icon ? (
    <React.Fragment>{icon}</React.Fragment>
  ) : (
    <img css={{ height: gs(2), width: gs(2) }} src={url} />
  );
