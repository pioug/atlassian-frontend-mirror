import React from 'react';
import { IconProps } from '../types';

export default function IconImages({ label = '' }: IconProps) {
  return (
    <div
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: `<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient x1="46.315%" y1="-31.529%" x2="50%" y2="100%" id="images-a"><stop stop-color="#FFD500" offset="0%"/><stop stop-color="#FFAB00" offset="100%"/></linearGradient><linearGradient x1="100.699%" y1="50%" x2="-14.52%" y2="50%" id="images-b"><stop stop-color="#FAFBFC" offset="0%"/><stop stop-color="#F4F6F8" stop-opacity=".859" offset="12.52%"/><stop stop-color="#E3E6EA" stop-opacity=".402" offset="54.65%"/><stop stop-color="#D7DCE1" stop-opacity=".113" offset="83.66%"/><stop stop-color="#D3D8DE" stop-opacity="0" offset="97.03%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path fill="#FFF" d="M0 0h40v40H0z"/><g transform="translate(4 9)" fill-rule="nonzero"><rect fill="url(#images-a)" width="32" height="24" rx="1"/><path fill="#E5E8EC" d="M4 4h24v16H4z"/><path fill="#0049B0" d="M6.351 18.062l5.594-6.017 5.594 6.017z"/><path fill="#0065FF" d="M9.341 18.062l8.198-8.818 8.198 8.818z"/><path d="M20.484 14.353c-2.618-1.255-5.104-.564-8.519-1.373C9.625 12.426 6.719 11.135 4 8v11.913h20.294c-.321-2.073-1.26-4.337-3.81-5.56z" fill="url(#images-b)" opacity=".37" style="mix-blend-mode:screen"/><ellipse fill="#FFAB00" cx="9" cy="9.028" rx="2" ry="2.028"/></g></g></svg>`,
      }}
    />
  );
}
