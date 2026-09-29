/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TagGroupProps
 *
 * @codegen <<SignedSource::0df95e27d0275d05831117bac3dc8be4>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/taggroup/__generated__/index.partial.tsx <<SignedSource::73fdd576f450618c7b2ca164320578f2>>
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