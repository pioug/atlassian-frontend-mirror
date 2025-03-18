/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabPanelProps
 *
 * @codegen <<SignedSource::81d45904da28e8174cfe981f4d3c9ff4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tabpanel.partial.tsx <<SignedSource::e7936c96c90f8f4682c85a00f85a23f4>>
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
 * A `TabPanel` houses the contents of a `Tab`.
 *
 * @see [TabPanel](https://developer.atlassian.com/platform/forge/ui-kit/components/tabs/) in UI Kit documentation for more information
 */
export type TTabPanel<T> = (props: TabPanelProps) => T;