/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - LabelProps
 *
 * @codegen <<SignedSource::1060d3a4c348411a20d24e09b4c762e0>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/label.partial.tsx <<SignedSource::1c3e979c083500f0d359be4748ce5e6e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import type { LabelProps as PlatformLabelProps } from '@atlaskit/form/label/default';

export type LabelProps = Pick<PlatformLabelProps, 'children' | 'testId' | 'id'> & {
	labelFor: string;
};

/**
 * A label represents a caption for an item in a user interface.
 *
 * @see [Label](https://developer.atlassian.com/platform/forge/ui-kit/components/form/#label) in UI Kit documentation for more information
 */
export type TLabel<T> = (props: LabelProps) => T;