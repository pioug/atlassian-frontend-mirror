/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RangeProps
 *
 * @codegen <<SignedSource::b8d42e64b587e4e3daad0988c1fe339e>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/range/__generated__/index.partial.tsx <<SignedSource::47b47ae1505ae1df985d952d77e858e8>>
 */
import React from 'react';
import PlatformRange from '@atlaskit/range';
import type { EventHandlerProps } from './types.codegen';

type PlatformRangeProps = React.ComponentProps<typeof PlatformRange>;

export type RangeProps = Pick<
  PlatformRangeProps,
  'defaultValue' | 'max' | 'min' | 'step' | 'testId' | 'onChange'
 | 'id' | 'isDisabled' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onBlur' | 'onFocus'>;