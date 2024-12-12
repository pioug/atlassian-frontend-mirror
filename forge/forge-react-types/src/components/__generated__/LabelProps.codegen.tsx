/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LabelProps
 *
 * @codegen <<SignedSource::3ffcab7388acd62d080e9bd44c09ee83>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/label.partial.tsx <<SignedSource::76a9bd0b52bc4cb5531064a7495532d5>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { LabelProps as PlatformLabelProps } from '@atlaskit/form';

export type LabelProps = Pick<PlatformLabelProps, 'children' | 'testId'| 'id' > & {labelFor : string}