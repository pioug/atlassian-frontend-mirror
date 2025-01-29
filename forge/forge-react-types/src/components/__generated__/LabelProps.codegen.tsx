/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LabelProps
 *
 * @codegen <<SignedSource::0a894a2ad4f4410a2c67f12f0287dbcd>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/label.partial.tsx <<SignedSource::60bad4561265206e7c10d92a99fce9f4>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { LabelProps as PlatformLabelProps } from '@atlaskit/form';

export type LabelProps = Pick<PlatformLabelProps, 'children' | 'testId' | 'id'> & {
	labelFor: string;
};

/**
 * A form allows users to input information.
 */
export type TLabel<T> = (props: LabelProps) => T;