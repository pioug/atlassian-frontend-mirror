import React from 'react';
import { IconProps } from '../types';

export default function IconDecision({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><path d="M10 10h29v20H10a3 3 0 0 1-3-3V13a3 3 0 0 1 3-3z" fill="#ECEDF0"/><path d="M14.414 16l3.293 3.293c.187.187.293.442.293.707v5a1 1 0 0 1-2 0v-4.586l-3-3V18.5a1 1 0 0 1-2 0V15a1 1 0 0 1 1-1h3.5a1 1 0 0 1 0 2h-1.086zm8.293-1.707a.999.999 0 0 1 0 1.414l-2.5 2.5a.997.997 0 0 1-1.414 0 .999.999 0 0 1 0-1.414l2.5-2.5a.999.999 0 0 1 1.414 0z" fill="#36B37E"/><path d="M27 19h12v2H27a1 1 0 0 1 0-2z" fill="#C1C7D0"/></g></svg>`,
      }}
    />
  );
}
