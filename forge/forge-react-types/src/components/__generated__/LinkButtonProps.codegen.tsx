/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LinkButtonProps
 *
 * @codegen <<SignedSource::ac79b85bde2efadf2186ea5acd6d267e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/__generated__/link-button.partial.tsx <<SignedSource::4f0e6eb251c01a13ba006b3d7569820d>>
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

export type TLinkButton<T> = (props: LinkButtonProps) => T;