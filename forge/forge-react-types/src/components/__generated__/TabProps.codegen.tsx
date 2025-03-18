/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabProps
 *
 * @codegen <<SignedSource::06bf788051c0103d75e2ff758f1982ad>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tab.partial.tsx <<SignedSource::05b588ddfb6bfa200363a1127660dce4>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Tab as PlatformTab } from '@atlaskit/tabs';

type PlatformTabProps = React.ComponentProps<typeof PlatformTab>;

export type TabProps = Pick<
  PlatformTabProps,
  'children' | 'testId'
>;

/**
 * `Tab` represents an individual tab displayed in a TabList.
 *
 * @see [Tab](https://developer.atlassian.com/platform/forge/ui-kit/components/tabs/) in UI Kit documentation for more information
 */
export type TTab<T> = (props: TabProps) => T;