import React from 'react';
import { IconProps } from '../types';

export default function IconMention({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><g transform="translate(6 12)"><circle fill="#2684FF" cx="8" cy="8" r="8"/><path d="M12.875 12.767A6.891 6.891 0 0 1 8.02 14.75a6.889 6.889 0 0 1-4.895-2.026V11.9c0-1.049.873-1.9 1.95-1.9h5.85c1.077 0 1.95.851 1.95 1.9v.867zM8 3a2.874 2.874 0 1 0-.001 5.748 2.874 2.874 0 0 0 0-5.748" fill="#B3D4FF"/><rect fill="#A5ADBA" x="19" y="3" width="12" height="1" rx=".5"/><rect fill="#A5ADBA" x="19" y="7" width="6" height="1" rx=".5"/><rect fill="#A5ADBA" x="19" y="11" width="8" height="1" rx=".5"/></g></g></svg>`,
      }}
    />
  );
}
