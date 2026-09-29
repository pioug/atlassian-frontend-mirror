/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabListProps
 *
 * @codegen <<SignedSource::49b8ec600d3d1d68103d27885366adad>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tablist.partial.tsx <<SignedSource::9b4a3e8b458ecab7eac745604b24f82d>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTabList from '@atlaskit/tabs/tab-list';

type PlatformTabListProps = React.ComponentProps<typeof PlatformTabList>;

export type TabListProps = Pick<
  PlatformTabListProps,
  'children'
>;

/**
 * A `TabList` groups `Tab` components together.
 *
 * @see [TabList](https://developer.atlassian.com/platform/forge/ui-kit/components/tab-list/) in UI Kit documentation for more information
 */
export type TTabList<T> = (props: TabListProps) => T;