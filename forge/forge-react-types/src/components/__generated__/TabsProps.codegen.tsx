/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabsProps
 *
 * @codegen <<SignedSource::6cb500bd3d514e486ff5f0d4159adeba>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tabs.partial.tsx <<SignedSource::15b1190f9455e6573f225c044c8e9ab1>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTabs from '@atlaskit/tabs';

type PlatformTabsProps = React.ComponentProps<typeof PlatformTabs>;

export type TabsProps = Pick<
  PlatformTabsProps,
  'id' | 'children' | 'defaultSelected' | 'onChange' | 'selected' | 'shouldUnmountTabPanelOnChange' | 'testId'
>;