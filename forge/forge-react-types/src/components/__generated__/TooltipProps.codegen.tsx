/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TooltipProps
 *
 * @codegen <<SignedSource::9aa991d0f73b4055a3453375ad75cd71>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tooltip/__generated__/index.partial.tsx <<SignedSource::e3e388170520502310149f23b8defa27>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformTooltip from '@atlaskit/tooltip';

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