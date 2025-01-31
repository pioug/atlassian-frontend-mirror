/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TagGroupProps
 *
 * @codegen <<SignedSource::45fcdf87d3eec9b19786d1085f656356>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/taggroup/__generated__/index.partial.tsx <<SignedSource::5ecfc76aae3b3e7f55b076d81f20c782>>
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
 */
export type TTagGroup<T> = (props: TagGroupProps) => T;