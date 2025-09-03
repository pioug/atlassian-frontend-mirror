/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TopNavProps
 *
 * @codegen <<SignedSource::cfccf71be2860c34c0b3e8fd7e5bcc85>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/top-nav/__generated__/index.partial.tsx <<SignedSource::89ced6c24bd1d4d3dec7d8ef5b5723a7>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TopNav as PlatformTopNav } from '@atlaskit/navigation-system/layout/top-nav';

type PlatformTopNavProps = React.ComponentProps<typeof PlatformTopNav>;

export type TopNavProps = Pick<
  PlatformTopNavProps,
  'children' | 'testId' | 'UNSAFE_theme'
>;

export type TTopNav<T> = (props: TopNavProps) => T;