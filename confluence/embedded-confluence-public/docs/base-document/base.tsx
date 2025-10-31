import React, { type ReactNode } from 'react';

import { code } from '@atlaskit/docs';

import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const components = {
	code({ children, inline }: { children: ReactNode[]; inline?: boolean }) {
		// eslint-disable-next-line @atlaskit/design-system/no-html-code
		return inline ? <code>{children}</code> : code`${children}`;
	},
};
export default function Base(props: any): React.JSX.Element {
	return <ReactMarkdown children={props.content} components={components} remarkPlugins={[gfm]} />;
}
