/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormFooterProps
 *
 * @codegen <<SignedSource::b0960222fe8be4e1a432650bc82ba70c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/__generated__/form-footer.partial.tsx <<SignedSource::e1c39bcdc2f7edc7d21cd21e0c4a47ca>>
 */
import React from 'react';
import { FormFooter as PlatformFormFooter } from '@atlaskit/form';

type PlatformFormFooterProps = React.ComponentProps<typeof PlatformFormFooter>;

export type FormFooterProps = Pick<
  PlatformFormFooterProps,
  'children' | 'align'
>;