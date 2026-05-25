/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
/**
* Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
* Used via `componentWithCondition` in `index.tsx`.
*
* Cleanup: delete this file once the experiment has shipped.
**/

import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- intentional: emotion fallback for compiled migration
import { jsx } from '@emotion/react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- intentional: emotion fallback for compiled migration
import { inputStyle } from './styles';

export const ChromeCollapsedEmotion: React.ForwardRefExoticComponent<
	InputHTMLAttributes<HTMLInputElement> & React.RefAttributes<HTMLInputElement>
> = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
	// eslint-disable-next-line react/jsx-props-no-spreading, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- intentional: emotion fallback for compiled migration
	({ ...rest }, ref) => <input ref={ref} css={inputStyle} {...rest} />,
);
