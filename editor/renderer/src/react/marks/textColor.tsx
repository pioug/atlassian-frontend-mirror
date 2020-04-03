import React from 'react';
export default function TextColor(props: { color: string } & React.Props<any>) {
  return <span style={{ color: props.color }}>{props.children}</span>;
}
