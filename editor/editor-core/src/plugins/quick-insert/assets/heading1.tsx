import React from 'react';
import { IconProps } from '../types';

export default function IconHeading1({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><rect fill="#C1C7D0" x="6" y="32" width="20" height="1" rx=".5"/><rect fill="#C1C7D0" x="6" y="29" width="28" height="1" rx=".5"/><rect fill="#C1C7D0" x="6" y="26" width="28" height="1" rx=".5"/><path d="M16.336 7.232h2.88V23h-2.88v-6.528H8.944V23h-2.88V7.232h2.88v6.624h7.392V7.232zM28.206 23h-2.88V9.992l-3.264 1.2V8.504l4.056-1.272h2.088V23z" fill="#172B4D" fill-rule="nonzero"/></g></svg>`,
      }}
    />
  );
}
