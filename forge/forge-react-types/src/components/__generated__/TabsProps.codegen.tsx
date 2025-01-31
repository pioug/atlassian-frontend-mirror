/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabsProps
 *
 * @codegen <<SignedSource::218a06565465557c9f3831d190600268>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tabs.partial.tsx <<SignedSource::f5d8442dd79c61463d58ed2e436af3f4>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTabs from '@atlaskit/tabs';

type PlatformTabsProps = React.ComponentProps<typeof PlatformTabs>;

export type TabsProps = Pick<
  PlatformTabsProps,
  'id' | 'children' | 'defaultSelected' | 'onChange' | 'selected' | 'shouldUnmountTabPanelOnChange' | 'testId'
>;

/**
 * Tabs are used to organize content by grouping similar information on the same page.
 */
export type TTabs<T> = (props: TabsProps) => T;