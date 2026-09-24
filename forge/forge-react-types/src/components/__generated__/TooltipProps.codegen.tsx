/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TooltipProps
 *
 * @codegen <<SignedSource::2a91d2b46e44aca1781046d3838d7a55>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tooltip/__generated__/index.partial.tsx <<SignedSource::2ca2bf0b16bf227081138a7445283641>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTooltip from '@atlaskit/tooltip/Tooltip';

type PlatformTooltipProps = React.ComponentProps<typeof PlatformTooltip>;

export type TooltipProps = Pick<
  PlatformTooltipProps,
  'children' | 'position' | 'mousePosition' | 'content' | 'truncate' | 'testId' | 'delay'
>;

/**
 * A `Tooltip` is a floating, non-actionable label used to explain a user interface element or feature.
 *
 * @see [Tooltip](https://developer.atlassian.com/platform/forge/ui-kit/components/tooltip/) in UI Kit documentation for more information
 */
export type TTooltip<T> = (props: TooltipProps) => T;