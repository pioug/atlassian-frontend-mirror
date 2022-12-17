import React, { ReactNode } from 'react';

import { code } from '@atlaskit/docs';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const components = {
  code({ children, inline }: { children: ReactNode[]; inline?: boolean }) {
    return inline ? <code>{children}</code> : code`${children}`;
  },
};
export default function Base(props: any) {
  return (
    <ReactMarkdown
      children={props.content}
      components={components}
      remarkPlugins={[gfm]}
    />
  );
}
