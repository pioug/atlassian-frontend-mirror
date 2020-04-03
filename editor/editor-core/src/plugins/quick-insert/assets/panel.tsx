import React from 'react';
import { IconProps } from '../types';

export default function IconPanel({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><rect fill="#DEEBFF" x="8" y="12" width="32" height="16" rx="1"/><path d="M12 20a4 4 0 1 0 8 0 4 4 0 0 0-8 0z" fill="#0052CC" fill-rule="nonzero"/><rect fill="#FFF" fill-rule="nonzero" x="15.556" y="19.722" width="1" height="2.2" rx=".5"/><circle fill="#FFF" fill-rule="nonzero" cx="16" cy="18.444" r="1"/></g></svg>`,
      }}
    />
  );
}
