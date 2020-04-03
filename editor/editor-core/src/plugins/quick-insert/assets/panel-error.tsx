import React from 'react';
import { IconProps } from '../types';

export default function IconPanelError({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><rect fill="#FFEBE6" x="8" y="12" width="32" height="16" rx="1"/><path d="M16.743 19.964l1.06-1.06a.5.5 0 0 0-.707-.707l-1.06 1.06-1.061-1.06a.5.5 0 0 0-.707.707l1.06 1.06-1.06 1.061a.5.5 0 1 0 .707.707l1.06-1.06 1.061 1.06a.5.5 0 1 0 .707-.707l-1.06-1.06zM16 24a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="#DE350B"/></g></svg>`,
      }}
    />
  );
}
