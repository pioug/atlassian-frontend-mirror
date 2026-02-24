import React from 'react';
import Link, { type LinkProps } from '@atlaskit/link';

function isRelativePath(path: string): boolean {
	return path?.startsWith('./') || path?.startsWith('/') || path?.startsWith('#');
}

export function MarkdownLink({ children, href, ...otherProps }: LinkProps) {
	return (
		<Link
			// For relative links, we don't set a target.
			// target="_self" would cause a full page reload, which is unnecessary.
			target={isRelativePath(href) ? undefined : '_blank'}
			href={href}
			{...otherProps}
		>
			{children}
		</Link>
	);
}
