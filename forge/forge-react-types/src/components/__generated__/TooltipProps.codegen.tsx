/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - TooltipProps
 *
 * @codegen <<SignedSource::d67c937dcf799eb3d57dc35b62b52bd4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/tooltip/__generated__/index.partial.tsx <<SignedSource::f5b26159e3b08ac61199d599900f523d>>
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
 * A tooltip is a floating, non-actionable label used to explain a user interface element or feature.
 */
export type TTooltip<T> = (props: TooltipProps) => T;