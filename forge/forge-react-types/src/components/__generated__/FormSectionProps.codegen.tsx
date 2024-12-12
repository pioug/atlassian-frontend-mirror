/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormSectionProps
 *
 * @codegen <<SignedSource::594fc69bc1d8fec83eea322b3fd188ee>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-section.partial.tsx <<SignedSource::d1562b48595a99e4857a21988f0a98cb>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { FormSection as PlatformFormSection } from '@atlaskit/form';

type PlatformFormSectionProps = React.ComponentProps<typeof PlatformFormSection>;

export type FormSectionProps = Pick<
  PlatformFormSectionProps,
  'title' | 'children' | 'description'
>;