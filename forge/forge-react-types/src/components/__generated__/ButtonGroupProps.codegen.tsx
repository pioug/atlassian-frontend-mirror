/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ButtonGroupProps
 *
 * @codegen <<SignedSource::3db26e916754166c96ff95c6a3116fde>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/__generated__/button-group.partial.tsx <<SignedSource::666485d8b6ea5b6d2ce21df5cfa1165a>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ButtonGroupProps as PlatformButtonGroupProps } from '@atlaskit/button/button-group';
import type { ButtonProps } from '@atlaskit/button/button';

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