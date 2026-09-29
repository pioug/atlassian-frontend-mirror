/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TooltipProps
 *
 * @codegen <<SignedSource::3e58d8bd5e894815e523ef8a5436e60c>>
 * @codegenCommand afm workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tooltip/__generated__/index.partial.tsx <<SignedSource::4288c870a8a74c631d4f81d015fba8fe>>
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