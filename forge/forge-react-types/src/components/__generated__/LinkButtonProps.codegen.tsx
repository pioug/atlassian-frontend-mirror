/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LinkButtonProps
 *
 * @codegen <<SignedSource::a0706b50117ae79c37006d0abc9de444>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/__generated__/link-button.partial.tsx <<SignedSource::6977fab8ea9a5478c26d6e1e77eab843>>
 */
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