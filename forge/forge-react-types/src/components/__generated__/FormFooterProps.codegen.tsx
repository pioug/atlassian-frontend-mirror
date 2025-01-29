/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormFooterProps
 *
 * @codegen <<SignedSource::cb77ae443b27f1229afcd556eb365acf>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-footer.partial.tsx <<SignedSource::ff2413efe154db0f89a03200caf50ced>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { FormFooter as PlatformFormFooter } from '@atlaskit/form';

type PlatformFormFooterProps = React.ComponentProps<typeof PlatformFormFooter>;

export type FormFooterProps = Pick<
  PlatformFormFooterProps,
  'children' | 'align'
>;

/**
 * A form allows users to input information.
 */
export type TFormFooter<T> = (props: FormFooterProps) => T;