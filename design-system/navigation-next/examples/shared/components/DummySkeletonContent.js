import React from 'react';

const ROWS = 50;

const shadow = () => {
  const str = [];
  for (let i = 0; i < ROWS; i++) {
    str.push(`0 ${32 * i}px 0 0 rgba(0, 0, 0, 0.1)`);
  }
  return str.join(',');
};

export const DummySkeletonContent = () => {
  return (
    <div
      css={{
        margin: '0.5em 0 0 0',
        height: ROWS * 32,
        '&::before': {
          borderRadius: '3px',
          content: "' '",
          height: '20px',
          display: 'block',
          width: '100%',
          boxShadow: `0 0 0 20px rgba(0, 0, 0, 0.1) inset,${shadow()}`,
        },
      }}
    />
  );
};
