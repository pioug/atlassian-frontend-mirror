/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TileProps
 *
 * @codegen <<SignedSource::5d13e3249900bc850b7d284cc43e94ad>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tile/__generated__/index.partial.tsx <<SignedSource::23868ca73e2f361dc2496ab2db9369a2>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTile from '@atlaskit/tile/tile';

type PlatformTileProps = React.ComponentProps<typeof PlatformTile>;

export type TileProps = Pick<
  PlatformTileProps,
  'backgroundColor' | 'label' | 'size' | 'children' | 'hasBorder' | 'isInset' | 'testId'
>;

/**
 * A tile is a rounded square that takes an asset and represents a noun.
 *
 * @see [Tile](https://developer.atlassian.com/platform/forge/ui-kit/components/tile/) in UI Kit documentation for more information
 */
export type TTile<T> = (props: TileProps) => T;