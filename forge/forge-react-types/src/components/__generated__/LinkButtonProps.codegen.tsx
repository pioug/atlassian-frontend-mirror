/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LinkButtonProps
 *
 * @codegen <<SignedSource::65d972f12bee563f4cc6b347e042dc57>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/link-button.tsx <<SignedSource::260bb0ac991e48b6e7f0da4b938d73c7>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import type { LinkButtonProps as PlatformLinkButtonProps } from '@atlaskit/button/new';

export type LinkButtonProps = Pick<
	PlatformLinkButtonProps,
	| 'children'
	| 'target'
	| 'autoFocus'
	| 'isDisabled'
	| 'isSelected'
	| 'onBlur'
	| 'onClick'
	| 'onFocus'
	| 'testId'
	| 'shouldFitContainer'
> & {
	appearance?: PlatformLinkButtonProps['appearance'] | 'link' | 'subtle-link';
	href?: string;
	ref?: React.Ref<HTMLAnchorElement>;
	spacing?: PlatformLinkButtonProps['spacing'] | 'none';
};

/**
 * Renders a link in the style of a button.
 *
 * @see [LinkButton](https://developer.atlassian.com/platform/forge/ui-kit/components/button/#linkbutton-props) in UI Kit documentation for more information
 */
export type TLinkButton<T> = (props: LinkButtonProps) => T;