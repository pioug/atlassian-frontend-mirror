/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabProps
 *
 * @codegen <<SignedSource::6b0d6b725c7692c9bfcddf45f3ca4f1f>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tab.partial.tsx <<SignedSource::f5363c279366b51358d257738457c7d5>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Tab as PlatformTab } from '@atlaskit/tabs';

type PlatformTabProps = React.ComponentProps<typeof PlatformTab>;

export type TabProps = Pick<
  PlatformTabProps,
  'children' | 'testId'
>;

/**
 * Tabs are used to organize content by grouping similar information on the same page.
 */
export type TTab<T> = (props: TabProps) => T;