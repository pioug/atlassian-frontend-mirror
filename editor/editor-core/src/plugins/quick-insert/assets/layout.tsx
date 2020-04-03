import React from 'react';
import { IconProps } from '../types';

export default function IconLayout({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><rect fill="#A5ADBA" x="6" y="6" width="28" height="1" rx=".5"/><rect fill="#A5ADBA" x="6" y="10" width="28" height="1" rx=".5"/><rect fill="#A5ADBA" x="6" y="29" width="28" height="1" rx=".5"/><rect fill="#A5ADBA" x="6" y="33" width="16" height="1" rx=".5"/><rect stroke="#4C9AFF" stroke-width=".5" fill="#DEEBFF" x="6.25" y="14.25" width="12.5" height="11.5" rx="1"/><rect stroke="#4C9AFF" stroke-width=".5" fill="#DEEBFF" x="21.25" y="14.25" width="12.5" height="11.5" rx="1"/></g></svg>`,
      }}
    />
  );
}
