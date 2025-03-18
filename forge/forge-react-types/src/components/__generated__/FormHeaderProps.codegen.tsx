/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormHeaderProps
 *
 * @codegen <<SignedSource::29600e7cd4c837834bdf3e2642eb297f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-header.partial.tsx <<SignedSource::8791c333c19a64caa8dd6b7461a53082>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { FormHeader as PlatformFormHeader } from '@atlaskit/form';

type PlatformFormHeaderProps = React.ComponentProps<typeof PlatformFormHeader>;

export type FormHeaderProps = Pick<
  PlatformFormHeaderProps,
  'title' | 'description' | 'children'
>;

/**
 * Use a form header to describe the contents of the form. This is the title and description of the form.
 * If your form contains required fields, the form header is also where you should include a legend
 * for sighted users to know that * indicates a required field.
 *
 * @see [FormHeader](https://developer.atlassian.com/platform/forge/ui-kit/components/form/#form-header) in UI Kit documentation for more information
 */
export type TFormHeader<T> = (props: FormHeaderProps) => T;