/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabPanelProps
 *
 * @codegen <<SignedSource::23850100586dbaed6adad6fcdf0509e5>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/tabs/__generated__/tabpanel.partial.tsx <<SignedSource::7c83ac40233c068627ed6b6c7db8e2d5>>
 */
import React from 'react';
import { TabPanel as PlatformTabPanel } from '@atlaskit/tabs';

type PlatformTabPanelProps = React.ComponentProps<typeof PlatformTabPanel>;

export type TabPanelProps = Pick<
  PlatformTabPanelProps,
  'children' | 'testId'
>;