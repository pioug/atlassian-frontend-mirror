/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - ToggleProps
 *
 * @codegen <<SignedSource::9fae69dce4ff6b99dfdeaff9a08a72f4>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/toggle/__generated__/index.partial.tsx <<SignedSource::c3ddcdd89af4be8543231a1ab89d8f45>>
 */
import React from 'react';
import PlatformToggle from '@atlaskit/toggle';
import type { EventHandlerProps } from './types.codegen';

type PlatformToggleProps = React.ComponentProps<typeof PlatformToggle>;

export type ToggleProps = Pick<
  PlatformToggleProps,
  'size' | 'testId' | 'defaultChecked' | 'isChecked' | 'label'
 | 'id' | 'isDisabled' | 'value' | 'name'
> & Pick<EventHandlerProps, 'onChange' | 'onBlur' | 'onFocus'>;