/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type ChangeEvent } from 'react';

import { jsx } from '@emotion/react'; // eslint-disable-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766

import { fileInputStyles } from './styles';

type FileInputProps = {
	type: string;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export const FileInput = ({ type, onChange }: FileInputProps): jsx.JSX.Element => {
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	return <input css={fileInputStyles} type={type} onChange={onChange} />;
};
