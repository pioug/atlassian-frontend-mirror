/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LinkButtonProps
 *
 * @codegen <<SignedSource::5954a642054228f3f1ffb106dca3072f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/__generated__/link-button.partial.tsx <<SignedSource::e74ee4aaf752a6e85a57950dce7a3683>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { LinkButtonProps as PlatformLinkButtonProps } from '@atlaskit/button/new';
import React from 'react';

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
	href?: string;
	ref?: React.Ref<HTMLAnchorElement>;
	appearance?: PlatformLinkButtonProps['appearance'] | 'link' | 'subtle-link';
	spacing?: PlatformLinkButtonProps['spacing'] | 'none';
};

/**
 * Renders a link in the style of a button.
 *
 * @see [LinkButton](https://developer.atlassian.com/platform/forge/ui-kit/components/button/#linkbutton-props) in UI Kit documentation for more information
 */
export type TLinkButton<T> = (props: LinkButtonProps) => T;