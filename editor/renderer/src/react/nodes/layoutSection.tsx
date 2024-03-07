import React from 'react';

export default function LayoutSection(props: React.PropsWithChildren<unknown>) {
  return <div data-layout-section>{props.children}</div>;
}
