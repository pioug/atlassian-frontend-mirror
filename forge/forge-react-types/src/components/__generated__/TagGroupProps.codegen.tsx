/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TagGroupProps
 *
 * @codegen <<SignedSource::5f784a44842dee8e17d2a7bcbf858b11>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/taggroup/__generated__/index.partial.tsx <<SignedSource::b061514ecbda77c4645fcc07d3d9a5cb>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTagGroup from '@atlaskit/tag-group';

type PlatformTagGroupProps = React.ComponentProps<typeof PlatformTagGroup>;

export type TagGroupProps = Pick<
  PlatformTagGroupProps,
  'children' | 'alignment'
>;

/**
 * A tag group controls the layout and alignment for a collection of tags.
 *
 * @see [TagGroup](https://developer.atlassian.com/platform/forge/ui-kit/components/tag-group/) in UI Kit documentation for more information
 */
export type TTagGroup<T> = (props: TagGroupProps) => T;