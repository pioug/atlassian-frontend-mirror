/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabListProps
 *
 * @codegen <<SignedSource::b0a70e674ab9c1eacb79ca5cb9e5a60b>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tablist.partial.tsx <<SignedSource::1f5c04bb243364d5edb96ba6d7bf4eab>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { TabList as PlatformTabList } from '@atlaskit/tabs';

type PlatformTabListProps = React.ComponentProps<typeof PlatformTabList>;

export type TabListProps = Pick<
  PlatformTabListProps,
  'children'
>;