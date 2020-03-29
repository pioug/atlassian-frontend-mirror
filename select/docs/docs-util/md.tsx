import React, { ReactNode } from 'react';
import { md } from '@atlaskit/docs';

function getLabel(children: ReactNode) {
  if (typeof children === 'number') {
    return children.toString();
  } else if (typeof children === 'string') {
    return children;
  } else {
    return '';
  }
}

function slugify(str: string): string {
  return str.replace(/\W/g, '-').toLowerCase();
}

const Heading = ({
  children,
  level,
}: {
  children: ReactNode;
  level: number;
}) => {
  const label = getLabel(children);
  const slug = slugify(label);

  return React.createElement(`h${level}`, { id: slug }, children);
};

export default md.customize({ renderers: { Heading } });
