import React from 'react';

export default function ReadmeDescription({ children }) {
  const style = { marginTop: 12 };

  return typeof children === 'string' ? (
    <p>{children}</p>
  ) : (
    <div style={style}>{children}</div>
  );
}
