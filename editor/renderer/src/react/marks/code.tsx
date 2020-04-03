import React from 'react';

export default function Code(props: { children: React.ReactNode }) {
  return <span className="code">{props.children}</span>;
}
