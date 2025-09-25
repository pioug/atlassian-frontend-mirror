/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormFooterProps
 *
 * @codegen <<SignedSource::4c90207f54696475cd9bfae6d8cfb8a9>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-footer.partial.tsx <<SignedSource::0b729df36afbc86cc134984bb4c16b3e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { FormFooter as PlatformFormFooter } from '@atlaskit/form';

export type PlatformFormFooterProps = Omit<_PlatformFormFooterProps, 'align'> & {
/**
 * Sets the alignment of the footer contents. This is often a button. Defaults to `end`.
 */
	align?: _PlatformFormFooterProps['align'];
}
type _PlatformFormFooterProps = React.ComponentProps<typeof PlatformFormFooter>;

export type FormFooterProps = Pick<
  PlatformFormFooterProps,
  'children' | 'align'
>;

/**
 * Use a form footer to set the content at the end of the form. This is used for a button that submits the form.
 *
 * This is positioned after the last field in the form.
 *
 * @see [FormFooter](https://developer.atlassian.com/platform/forge/ui-kit/components/form/#form-footer) in UI Kit documentation for more information
 */
export type TFormFooter<T> = (props: FormFooterProps) => T;