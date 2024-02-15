/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabListProps
 *
 * @codegen <<SignedSource::63ffe533762227705f9c9e5babcaa418>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/tabs/__generated__/tablist.partial.tsx <<SignedSource::5bc057d64440f3287fc195c987fd6a96>>
 */
import React from 'react';
import { TabList as PlatformTabList } from '@atlaskit/tabs';

type PlatformTabListProps = React.ComponentProps<typeof PlatformTabList>;

export type TabListProps = Pick<
  PlatformTabListProps,
  'children'
>;