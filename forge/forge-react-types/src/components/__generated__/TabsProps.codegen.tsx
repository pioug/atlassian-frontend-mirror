/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabsProps
 *
 * @codegen <<SignedSource::9f6b80e2a4dc5b84926377179fea3824>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tabs.partial.tsx <<SignedSource::15b1190f9455e6573f225c044c8e9ab1>>
 */
import React from 'react';
import PlatformTabs from '@atlaskit/tabs';

type PlatformTabsProps = React.ComponentProps<typeof PlatformTabs>;

export type TabsProps = Pick<
  PlatformTabsProps,
  'id' | 'children' | 'defaultSelected' | 'onChange' | 'selected' | 'shouldUnmountTabPanelOnChange' | 'testId'
>;