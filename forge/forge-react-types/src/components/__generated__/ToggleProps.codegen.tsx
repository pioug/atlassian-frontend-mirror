/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ToggleProps
 *
 * @codegen <<SignedSource::388ba32ab2e4bdf3dbe9d05944eb41f0>>
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
 */
export type TToggle<T> = (props: ToggleProps) => T;