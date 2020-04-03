import React from 'react';

export default function Inline(props: any) {
  const { children } = props;
  const childCount = React.Children.toArray(children).length;

  if (!childCount) {
    return <>&nbsp;</>;
  }

  return children;
}
