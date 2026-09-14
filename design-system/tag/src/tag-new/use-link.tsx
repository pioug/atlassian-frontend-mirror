import { type ComponentType } from 'react';

import Link, { type LinkProps } from '@atlaskit/link/link';

/**
 * Shared hook for link handling
 */
export function useLink(
	href: string | undefined,
	linkComponent: ComponentType<any> | undefined,
): {
	isLink: boolean;
	LinkComponent:
		| ComponentType<any>
		| (<RouterLinkConfig extends Record<string, any> = never>(
				props: LinkProps<RouterLinkConfig> & { ref?: import('react').Ref<HTMLAnchorElement> },
		  ) => JSX.Element);
} {
	const isLink = Boolean(href);
	const LinkComponent = linkComponent ?? Link;

	return { isLink, LinkComponent };
}
