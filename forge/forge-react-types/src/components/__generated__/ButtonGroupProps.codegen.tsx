/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ButtonGroupProps
 *
 * @codegen <<SignedSource::1ef4ff437dfe8a93cac3a0c5e3dbeef9>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/button/__generated__/button-group.partial.tsx <<SignedSource::8f41744fe0477b14db5f0c764e4d8a10>>
 */
import type { ButtonGroupProps as PlatformButtonGroupProps } from '@atlaskit/button';
import type { ButtonProps } from '@atlaskit/button';

export type ButtonGroupProps = Pick<
	PlatformButtonGroupProps,
	'children' | 'testId' | 'label' | 'titleId'
> & { appearance?: ButtonProps['appearance'] };