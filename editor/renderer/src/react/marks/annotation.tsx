import React from 'react';

export interface Props {
  id: string;
  annotationType: string;
  children: React.ReactNode;
}

export default ({ id, annotationType, children }: Props) => (
  <span
    data-mark-type="annotation"
    data-mark-annotation-type={annotationType}
    data-id={id}
  >
    {children}
  </span>
);
