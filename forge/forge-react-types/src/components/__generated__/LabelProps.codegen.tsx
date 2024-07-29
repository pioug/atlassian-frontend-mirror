/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LabelProps
 *
 * @codegen <<SignedSource::07e819c10405f43c50c0f893eed98cfc>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/label.partial.tsx <<SignedSource::76a9bd0b52bc4cb5531064a7495532d5>>
 */
import type { LabelProps as PlatformLabelProps } from '@atlaskit/form';

export type LabelProps = Pick<PlatformLabelProps, 'children' | 'testId'| 'id' > & {labelFor : string}