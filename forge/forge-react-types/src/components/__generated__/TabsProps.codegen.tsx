/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabsProps
 *
 * @codegen <<SignedSource::65c56823ad6ac1820a77b5e8646bdc6f>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tabs.partial.tsx <<SignedSource::103ed225621a14a0f83807fb39201e0c>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTabs from '@atlaskit/tabs/tabs';

type PlatformTabsProps = React.ComponentProps<typeof PlatformTabs>;

export type TabsProps = Pick<
  PlatformTabsProps,
  'id' | 'children' | 'defaultSelected' | 'onChange' | 'selected' | 'shouldUnmountTabPanelOnChange' | 'testId'
>;

/**
 * Tabs are used to organize content by grouping similar information on the same page.
 *
 * @see [Tabs](https://developer.atlassian.com/platform/forge/ui-kit/components/tabs/) in UI Kit documentation for more information
 */
export type TTabs<T> = (props: TabsProps) => T;