/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::1306b0b1e9a60b010cca8208becbe8c4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/heading/__generated__/index.partial.tsx <<SignedSource::677018b16c2e8351e870a8d303ad7b61>>
 */
import type { HeadingProps as PlatformHeadingProps } from '@atlaskit/heading';

type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = Pick<
  PlatformHeadingProps,
   'children' | 'color' | 'id' | 'testId'
  > & { as: HeadingTags };