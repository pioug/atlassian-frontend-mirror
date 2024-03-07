/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabPanelProps
 *
 * @codegen <<SignedSource::7ad7e0f3e89d48d3bafa91c1bba0eb25>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/tabs/__generated__/tabpanel.partial.tsx <<SignedSource::76baa39c69317c03c4db2e4d8b7940af>>
 */
import React from 'react';
import { TabPanel as PlatformTabPanel } from '@atlaskit/tabs';

type PlatformTabPanelProps = React.ComponentProps<typeof PlatformTabPanel>;

export type TabPanelProps = Pick<
  PlatformTabPanelProps,
  'children' | 'testId'
>;