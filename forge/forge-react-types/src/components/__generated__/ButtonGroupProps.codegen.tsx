/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ButtonGroupProps
 *
 * @codegen <<SignedSource::17e4c7b27bf25505bd192e44f0bc3c37>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/__generated__/button-group.partial.tsx <<SignedSource::425feaa78f4ad0ff0373e9e49718c6f9>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ButtonGroupProps as PlatformButtonGroupProps, ButtonProps } from '@atlaskit/button';

export type ButtonGroupProps = Pick<
	PlatformButtonGroupProps,
	'children' | 'testId' | 'label' | 'titleId'
> & { appearance?: ButtonProps['appearance'] };

/**
 * A button group gives users access to frequently performed, related actions.
 *
 * @see [ButtonGroup](https://developer.atlassian.com/platform/forge/ui-kit/components/button-group/) in UI Kit documentation for more information
 */
export type TButtonGroup<T> = (props: ButtonGroupProps) => T;