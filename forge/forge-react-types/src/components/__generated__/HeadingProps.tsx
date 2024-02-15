/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - HeadingProps
 *
 * @codegen <<SignedSource::8409a2eefa3cf7f5f771289a92442ef8>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/heading/__generated__/index.partial.tsx <<SignedSource::fc98f8d0850307517dae4997972db5e8>>
 */
import type { HeadingProps as PlatformHeadingProps } from '@atlaskit/heading';

type HeadingTags = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingProps = Pick<
  PlatformHeadingProps,
   'children' | 'color' | 'id' | 'testId'
  > & { as: HeadingTags };