/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TagGroupProps
 *
 * @codegen <<SignedSource::62c8142dd4e6c4f797c463e56c1db939>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/taggroup/__generated__/index.partial.tsx <<SignedSource::3fbcfe988f4bfc964c9581a446d396c1>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTagGroup from '@atlaskit/tag-group';

type PlatformTagGroupProps = React.ComponentProps<typeof PlatformTagGroup>;

export type TagGroupProps = Pick<
  PlatformTagGroupProps,
  'children' | 'alignment'
>;