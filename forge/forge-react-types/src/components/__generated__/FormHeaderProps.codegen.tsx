/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - FormHeaderProps
 *
 * @codegen <<SignedSource::d8deb5d9e54d7bbbf5f338de52efe8cd>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/form/__generated__/form-header.partial.tsx <<SignedSource::a819d70cfd6efa6115889e0353f7ec5f>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { FormHeader as PlatformFormHeader } from '@atlaskit/form';

type PlatformFormHeaderProps = React.ComponentProps<typeof PlatformFormHeader>;

export type FormHeaderProps = Pick<
  PlatformFormHeaderProps,
  'title' | 'description' | 'children'
>;