/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BadgeProps
 *
 * @codegen <<SignedSource::673f5e6a8adc5b98f8bcb1a8de0644ef>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/badge/__generated__/index.partial.tsx <<SignedSource::2713f460c0b17d55cf5200b4e629a006>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformBadge from '@atlaskit/badge';

type PlatformBadgeProps = React.ComponentProps<typeof PlatformBadge>;

export type BadgeProps = Pick<
  PlatformBadgeProps,
  'appearance' | 'children' | 'max' | 'testId'
>;