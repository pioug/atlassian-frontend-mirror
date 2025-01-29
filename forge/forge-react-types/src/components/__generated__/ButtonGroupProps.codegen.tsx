/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ButtonGroupProps
 *
 * @codegen <<SignedSource::4daf3a960cc3108bbbc8ad0ede3b7011>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/button/__generated__/button-group.partial.tsx <<SignedSource::728cab6df690811513a66ea4bacb89c9>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { ButtonGroupProps as PlatformButtonGroupProps } from '@atlaskit/button';
import type { ButtonProps } from '@atlaskit/button';

export type ButtonGroupProps = Pick<
	PlatformButtonGroupProps,
	'children' | 'testId' | 'label' | 'titleId'
> & { appearance?: ButtonProps['appearance'] };

/**
 * A button triggers an event or action. They let users know what will happen next.
 */
export type TButtonGroup<T> = (props: ButtonGroupProps) => T;