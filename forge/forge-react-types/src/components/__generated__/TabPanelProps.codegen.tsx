/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabPanelProps
 *
 * @codegen <<SignedSource::e98bc9e4b752705298ebad67615c0c5d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tabpanel.partial.tsx <<SignedSource::76baa39c69317c03c4db2e4d8b7940af>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TabPanel as PlatformTabPanel } from '@atlaskit/tabs';

type PlatformTabPanelProps = React.ComponentProps<typeof PlatformTabPanel>;

export type TabPanelProps = Pick<
  PlatformTabPanelProps,
  'children' | 'testId'
>;