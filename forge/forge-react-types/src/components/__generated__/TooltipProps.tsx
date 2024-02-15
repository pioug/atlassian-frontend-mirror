/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TooltipProps
 *
 * @codegen <<SignedSource::576caa678bc143be2ce7ffd6ab5e0a92>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/tooltip/__generated__/index.partial.tsx <<SignedSource::2f2210c5abb648a5f1f8ca4a93eab74b>>
 */
import React from 'react';
import PlatformTooltip from '@atlaskit/tooltip';

type PlatformTooltipProps = React.ComponentProps<typeof PlatformTooltip>;

export type TooltipProps = Pick<
  PlatformTooltipProps,
  'children' | 'position' | 'mousePosition' | 'content' | 'truncate' | 'testId' | 'delay'
>;