import React from 'react';
export default function Strike(props: React.Props<any>) {
  return (
    <span style={{ textDecoration: 'line-through' }}>{props.children}</span>
  );
}
