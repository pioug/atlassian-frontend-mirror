/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ToggleProps
 *
 * @codegen <<SignedSource::26b64a1506fb8a63c7850417f78fd7ba>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/toggle/__generated__/index.partial.tsx <<SignedSource::b7d6483e971110f0134e350247bb54af>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformToggle from '@atlaskit/toggle';
import type { EventHandlerProps } from './types.codegen';

type PlatformToggleProps = React.ComponentProps<typeof PlatformToggle>;

export type ToggleProps = Pick<
  PlatformToggleProps,
  'size' | 'testId' | 'defaultChecked' | 'isChecked' | 'label'
 | 'id' | 'isDisabled' | 'value' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;

/**
 * A toggle is used to view or switch between enabled or disabled states.
 *
 * @see [Toggle](https://developer.atlassian.com/platform/forge/ui-kit/components/toggle/) in UI Kit documentation for more information
 */
export type TToggle<T> = (props: ToggleProps) => T;