/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - BannerProps
 *
 * @codegen <<SignedSource::8dbcd1242f8f41057dca14d4f74a0558>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/banner/__generated__/index.partial.tsx <<SignedSource::38dfbc20812e31312c3e7d8a543fc94d>>
 */
import React from 'react';
import PlatformBanner from '@atlaskit/banner';

type PlatformBannerProps = React.ComponentProps<typeof PlatformBanner>;

export type BannerProps = Pick<
  PlatformBannerProps,
  'appearance' | 'children' | 'icon' | 'testId'
>;