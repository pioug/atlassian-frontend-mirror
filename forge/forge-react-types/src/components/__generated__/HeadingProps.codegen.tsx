/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::f867438cb613d8c00ca40152aaa2e0f7>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/heading/__generated__/index.partial.tsx <<SignedSource::4110aff0cb97417eb95cc15681f8b097>>
 */
import type { HeadingProps as PlatformHeadingProps } from '@atlaskit/heading';

type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = Pick<
  PlatformHeadingProps,
   'children' | 'id' | 'testId'
  > & { as: HeadingTags, color: 'default' | 'inverse' };