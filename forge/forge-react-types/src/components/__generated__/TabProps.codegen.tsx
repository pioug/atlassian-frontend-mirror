/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabProps
 *
 * @codegen <<SignedSource::c45db800dc7a3a981f57cb6ca6fdb39e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/tabs/__generated__/tab.partial.tsx <<SignedSource::2ead4cab9a2f95ec27b0dee4d57ed3bc>>
 */
import React from 'react';
import { Tab as PlatformTab } from '@atlaskit/tabs';

type PlatformTabProps = React.ComponentProps<typeof PlatformTab>;

export type TabProps = Pick<
  PlatformTabProps,
  'children' | 'testId'
>;