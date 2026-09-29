/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabProps
 *
 * @codegen <<SignedSource::c3afc82d44b9fff45da0aa97e052a4d6>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tab.partial.tsx <<SignedSource::bf0b163600896ab26fca03aafae310f8>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTab from '@atlaskit/tabs/tab';

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