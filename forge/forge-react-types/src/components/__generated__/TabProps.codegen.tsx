/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TabProps
 *
 * @codegen <<SignedSource::b524262570052be714e6f79ea8498129>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tabs/__generated__/tab.partial.tsx <<SignedSource::2ead4cab9a2f95ec27b0dee4d57ed3bc>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import { Tab as PlatformTab } from '@atlaskit/tabs';

type PlatformTabProps = React.ComponentProps<typeof PlatformTab>;

export type TabProps = Pick<
  PlatformTabProps,
  'children' | 'testId'
>;