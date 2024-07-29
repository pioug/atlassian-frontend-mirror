/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormSectionProps
 *
 * @codegen <<SignedSource::f3caba8fa349e27d3573ce96a499d5bf>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-section.partial.tsx <<SignedSource::d1562b48595a99e4857a21988f0a98cb>>
 */
import React from 'react';
import { FormSection as PlatformFormSection } from '@atlaskit/form';

type PlatformFormSectionProps = React.ComponentProps<typeof PlatformFormSection>;

export type FormSectionProps = Pick<
  PlatformFormSectionProps,
  'title' | 'children' | 'description'
>;