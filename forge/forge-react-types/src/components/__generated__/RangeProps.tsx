/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Extract component prop types from UIKit 2 components - RangeProps
 *
 * @codegen <<SignedSource::a3ba5332bc965de0c74258782bdc959d>>
 * @codegenCommand yarn workspace @atlaskit/forge-react-types codegen
 * @codegenDependency ../../../../forge-ui/src/components/UIKit2-codegen/range/__generated__/index.partial.tsx <<SignedSource::6a83ab7c19defa5ffc5e20fb9b4b8481>>
 */
import React from 'react';
import PlatformRange from '@atlaskit/range';

type PlatformRangeProps = React.ComponentProps<typeof PlatformRange>;

export type RangeProps = Pick<
  PlatformRangeProps,
  'defaultValue' | 'max' | 'min' | 'step' | 'testId' | 'onChange'
 | 'id' | 'isDisabled' | 'onBlur' | 'onFocus' | 'value' | 'aria-invalid' | 'aria-labelledby' | 'name'
>;