/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabListProps
 *
 * @codegen <<SignedSource::0b9a412b7c677ada0a934306ee658f1d>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tablist.partial.tsx <<SignedSource::f1a0337b6b66af10809b71af1608b0ed>>
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