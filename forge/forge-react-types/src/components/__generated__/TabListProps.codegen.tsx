/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabListProps
 *
 * @codegen <<SignedSource::0ebcb7d52f40dc55d1ecb1924576a165>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tablist.partial.tsx <<SignedSource::fbd3384538b87c1a820790b55241ee21>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TabList as PlatformTabList } from '@atlaskit/tabs';

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