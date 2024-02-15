/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormHeaderProps
 *
 * @codegen <<SignedSource::f8c3507b0b60b7ae13c50fc98dd1ae6a>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/form/__generated__/form-header.partial.tsx <<SignedSource::39113f36661ff88dc89bcb117a37304b>>
 */
import React from 'react';
import { FormHeader as PlatformFormHeader } from '@atlaskit/form';

type PlatformFormHeaderProps = React.ComponentProps<typeof PlatformFormHeader>;

export type FormHeaderProps = Pick<
  PlatformFormHeaderProps,
  'title' | 'description' | 'children'
>;