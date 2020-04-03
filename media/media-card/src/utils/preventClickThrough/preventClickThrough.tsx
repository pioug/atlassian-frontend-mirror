import React from 'react';
import { ReactNode } from 'react';

export type PreventClickThroughProps = {
  readonly children?: ReactNode;
};

export function PreventClickThrough({
  children,
}: PreventClickThroughProps): JSX.Element {
  return (
    <span
      onClick={event => {
        event.stopPropagation();
        event.preventDefault();
      }}
    >
      {children}
    </span>
  );
}
