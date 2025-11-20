import React from 'react';
import { type OnSubmitHandler } from '@atlaskit/form';
import { PDFPasswordInput as CompiledPDFPasswordInput } from './pdfPasswordInput-compiled';

interface PDFPasswordInputProps {
	onSubmit: OnSubmitHandler<{ password: string }>;
	hasPasswordError?: boolean;
	onRender?: () => void;
}

export const PDFPasswordInput = (props: PDFPasswordInputProps): React.JSX.Element => (
	<CompiledPDFPasswordInput {...props} />
);
