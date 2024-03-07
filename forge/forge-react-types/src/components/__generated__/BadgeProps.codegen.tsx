/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BadgeProps
 *
 * @codegen <<SignedSource::85975a6d909dac72c1fcfcaf3f382cae>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/badge/__generated__/index.partial.tsx <<SignedSource::2713f460c0b17d55cf5200b4e629a006>>
 */
import React from 'react';
import PlatformBadge from '@atlaskit/badge';

type PlatformBadgeProps = React.ComponentProps<typeof PlatformBadge>;

export type BadgeProps = Pick<
  PlatformBadgeProps,
  'appearance' | 'children' | 'max' | 'testId'
>;