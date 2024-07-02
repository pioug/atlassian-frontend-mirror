/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BannerProps
 *
 * @codegen <<SignedSource::dc657434ee121c29c9a4922e2e858ae5>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/banner/__generated__/index.partial.tsx <<SignedSource::e02163bafd4666c3cdc45e6b76b57e9a>>
 */
import React from 'react';
import PlatformBanner from '@atlaskit/banner';

type PlatformBannerProps = React.ComponentProps<typeof PlatformBanner>;

export type BannerProps = Pick<
  PlatformBannerProps,
  'appearance' | 'children' | 'icon' | 'testId'
>;