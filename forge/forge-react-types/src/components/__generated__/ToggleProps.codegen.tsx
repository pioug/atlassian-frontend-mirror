/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ToggleProps
 *
 * @codegen <<SignedSource::f45908137974384e57d5a017c6d4a83c>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/toggle/__generated__/index.partial.tsx <<SignedSource::3dde2148a204d806089d1f512ae6afdb>>
 */
import React from 'react';
import PlatformToggle from '@atlaskit/toggle';
import type { EventHandlerProps } from './types.codegen';

type PlatformToggleProps = React.ComponentProps<typeof PlatformToggle>;

export type ToggleProps = Pick<
  PlatformToggleProps,
  'size' | 'testId' | 'defaultChecked' | 'isChecked' | 'label'
 | 'id' | 'isDisabled' | 'onChange' | 'onBlur' | 'onFocus' | 'value' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;