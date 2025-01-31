/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabPanelProps
 *
 * @codegen <<SignedSource::d880c7eaf445179245b8aea2d70ea39e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tabpanel.partial.tsx <<SignedSource::1bbc05ad9425e3df25423076ab0a0acf>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TabPanel as PlatformTabPanel } from '@atlaskit/tabs';

type PlatformTabPanelProps = React.ComponentProps<typeof PlatformTabPanel>;

export type TabPanelProps = Pick<
  PlatformTabPanelProps,
  'children' | 'testId'
>;

/**
 * Tabs are used to organize content by grouping similar information on the same page.
 */
export type TTabPanel<T> = (props: TabPanelProps) => T;