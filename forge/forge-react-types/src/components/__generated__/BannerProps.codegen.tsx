/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BannerProps
 *
 * @codegen <<SignedSource::344ca5e7438559794fc21ea8052787c1>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/banner/__generated__/index.partial.tsx <<SignedSource::e02163bafd4666c3cdc45e6b76b57e9a>>
 */
import React from 'react';
import PlatformBanner from '@atlaskit/banner';

type PlatformBannerProps = React.ComponentProps<typeof PlatformBanner>;

export type BannerProps = Pick<
  PlatformBannerProps,
  'appearance' | 'children' | 'icon' | 'testId'
>;