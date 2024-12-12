/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RangeProps
 *
 * @codegen <<SignedSource::56deb7fafdabfdd7bc9040bf16ef23a8>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit/range/__generated__/index.partial.tsx <<SignedSource::47b47ae1505ae1df985d952d77e858e8>>
 */
/* eslint @repo/internal/codegen/signed-source-integrity: "warn" */

import React from 'react';
import PlatformRange from '@atlaskit/range';
import type { EventHandlerProps } from './types.codegen';

type PlatformRangeProps = React.ComponentProps<typeof PlatformRange>;

export type RangeProps = Pick<
  PlatformRangeProps,
  'defaultValue' | 'max' | 'min' | 'step' | 'testId' | 'onChange'
 | 'id' | 'isDisabled' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
> & Pick<EventHandlerProps, 'onBlur' | 'onFocus'>;