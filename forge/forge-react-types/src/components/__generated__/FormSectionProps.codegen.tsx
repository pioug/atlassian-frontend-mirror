/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormSectionProps
 *
 * @codegen <<SignedSource::bb91841c1913229e7eb66d61b4ab693d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-section.partial.tsx <<SignedSource::7b30101c26550bb11c0f4ca6d4cf46fc>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { FormSection as PlatformFormSection } from '@atlaskit/form';

type PlatformFormSectionProps = React.ComponentProps<typeof PlatformFormSection>;

export type FormSectionProps = Pick<
  PlatformFormSectionProps,
  'title' | 'children' | 'description'
>;

/**
 * A form allows users to input information.
 */
export type TFormSection<T> = (props: FormSectionProps) => T;