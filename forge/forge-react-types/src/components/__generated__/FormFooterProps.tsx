/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormFooterProps
 *
 * @codegen <<SignedSource::a320a45e2726450da8f9af6eb0cc91b0>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/__generated__/form-footer.partial.tsx <<SignedSource::48598ee9bb091f4a0c034f3e0ce775dd>>
 */
import React from 'react';
import { FormFooter as PlatformFormFooter } from '@atlaskit/form';

type PlatformFormFooterProps = React.ComponentProps<typeof PlatformFormFooter>;

export type FormFooterProps = Pick<
  PlatformFormFooterProps,
  'children' | 'align'
>;