/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormHeaderProps
 *
 * @codegen <<SignedSource::74a8285c7ae5a0c5db7b8cafa4d8226b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-header.partial.tsx <<SignedSource::038ad7a850af23fb1c9b30de39ab0552>>
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
 * A form allows users to input information.
 */
export type TFormHeader<T> = (props: FormHeaderProps) => T;