/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormFooterProps
 *
 * @codegen <<SignedSource::9ec2f9424c5a4b781772fc94c3facff7>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-footer.partial.tsx <<SignedSource::e1c39bcdc2f7edc7d21cd21e0c4a47ca>>
 */
import React from 'react';
import { FormFooter as PlatformFormFooter } from '@atlaskit/form';

type PlatformFormFooterProps = React.ComponentProps<typeof PlatformFormFooter>;

export type FormFooterProps = Pick<
  PlatformFormFooterProps,
  'children' | 'align'
>;