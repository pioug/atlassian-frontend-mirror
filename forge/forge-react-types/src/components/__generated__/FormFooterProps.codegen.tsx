/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormFooterProps
 *
 * @codegen <<SignedSource::e6d74700f46888d63a013f997339596b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-footer.partial.tsx <<SignedSource::0b729df36afbc86cc134984bb4c16b3e>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { FormFooter as PlatformFormFooter } from '@atlaskit/form';

type _PlatformFormFooterProps = React.ComponentProps<typeof PlatformFormFooter>;
export type PlatformFormFooterProps = Omit<_PlatformFormFooterProps, 'align'> & {
/**
 * Sets the alignment of the footer contents. This is often a button. Defaults to `end`.
 */
	align?: _PlatformFormFooterProps['align'];
}

export type FormFooterProps = Pick<
  PlatformFormFooterProps,
  'children' | 'align'
>;

/**
 * Use a form footer to set the content at the end of the form. This is used for a button that submits the form.
 * 
 * This is positioned after the last field in the form.
 */
export type TFormFooter<T> = (props: FormFooterProps) => T;