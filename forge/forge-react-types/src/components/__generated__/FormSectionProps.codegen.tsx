/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormSectionProps
 *
 * @codegen <<SignedSource::f7f0f7f8ae11d45bd219cd4ffbc3515e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/__generated__/form-section.partial.tsx <<SignedSource::d1562b48595a99e4857a21988f0a98cb>>
 */
import React from 'react';
import { FormSection as PlatformFormSection } from '@atlaskit/form';

type PlatformFormSectionProps = React.ComponentProps<typeof PlatformFormSection>;

export type FormSectionProps = Pick<
  PlatformFormSectionProps,
  'title' | 'children' | 'description'
>;