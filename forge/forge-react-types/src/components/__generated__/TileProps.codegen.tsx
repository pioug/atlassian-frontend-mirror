/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TileProps
 *
 * @codegen <<SignedSource::8b1e13d93e3348f59fa7b79a0da227aa>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tile/__generated__/index.partial.tsx <<SignedSource::d7ec62556fa495888b1d4326b71c4d52>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTile from '@atlaskit/tile';

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