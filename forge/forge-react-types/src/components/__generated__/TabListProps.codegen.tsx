/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabListProps
 *
 * @codegen <<SignedSource::0b10d2d919012771dcb780ff32d5cfd2>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tablist.partial.tsx <<SignedSource::4ada894a5d94a305fa30eb45a6759915>>
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
 * Tabs are used to organize content by grouping similar information on the same page.
 */
export type TTabList<T> = (props: TabListProps) => T;