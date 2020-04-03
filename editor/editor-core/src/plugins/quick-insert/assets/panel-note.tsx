import React from 'react';
import { IconProps } from '../types';

export default function IconPanelNote({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><rect fill="#EAE6FF" x="8" y="12" width="32" height="16" rx="1"/><path d="M13 16h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1zm1 2a.5.5 0 1 0 0 1h2a.5.5 0 1 0 0-1h-2zm0 2a.5.5 0 1 0 0 1h1a.5.5 0 1 0 0-1h-1z" fill="#403294"/></g></svg>`,
      }}
    />
  );
}
