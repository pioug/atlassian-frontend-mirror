import React from 'react';
import { IconProps } from '../types';

export default function IconList({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><g transform="translate(8 10)"><rect fill="#6C798F" width="4" height="4" rx="2"/><rect fill="#C1C7D0" x="7" y="9" width="17" height="2" rx="1"/><rect fill="#C1C7D0" x="7" y="1" width="17" height="2" rx="1"/><rect fill="#C1C7D0" x="7" y="17" width="17" height="2" rx="1"/><rect fill="#6C798F" y="8" width="4" height="4" rx="2"/><rect fill="#6C798F" y="16" width="4" height="4" rx="2"/></g></g></svg>`,
      }}
    />
  );
}
