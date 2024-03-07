import React from 'react';
export default function UnknownBlock(props: React.PropsWithChildren<unknown>) {
  return <div className="UnknownBlock">{props.children}</div>;
}
