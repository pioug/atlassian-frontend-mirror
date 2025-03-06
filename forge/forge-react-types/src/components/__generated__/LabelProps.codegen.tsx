/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LabelProps
 *
 * @codegen <<SignedSource::f12ab4339e5503f7db96ce306da7f685>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/label.partial.tsx <<SignedSource::55ecafcd1d98afb9b7f6f37d5168725c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { LabelProps as PlatformLabelProps } from '@atlaskit/form';

export type LabelProps = Pick<PlatformLabelProps, 'children' | 'testId' | 'id'> & {
	labelFor: string;
};

/**
 * A label represents a caption for an item in a user interface.
 */
export type TLabel<T> = (props: LabelProps) => T;