/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabsProps
 *
 * @codegen <<SignedSource::b98ae2c297fe09a16bc2b2bb72d178fb>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/tabs/__generated__/tabs.partial.tsx <<SignedSource::15b1190f9455e6573f225c044c8e9ab1>>
 */
import React from 'react';
import PlatformTabs from '@atlaskit/tabs';

type PlatformTabsProps = React.ComponentProps<typeof PlatformTabs>;

export type TabsProps = Pick<
  PlatformTabsProps,
  'id' | 'children' | 'defaultSelected' | 'onChange' | 'selected' | 'shouldUnmountTabPanelOnChange' | 'testId'
>;