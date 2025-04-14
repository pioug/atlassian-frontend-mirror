import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { type OnSubmitHandler } from '@atlaskit/form';
import { PDFPasswordInput as CompiledPDFPasswordInput } from './pdfPasswordInput-compiled';
import { PDFPasswordInput as EmotionPDFPasswordInput } from './pdfPasswordInput-emotion';

interface PDFPasswordInputProps {
	onSubmit: OnSubmitHandler<{ password: string }>;
	hasPasswordError?: boolean;
	onRender?: () => void;
}

export const PDFPasswordInput = (props: PDFPasswordInputProps) =>
	fg('platform_media_compiled') ? (
		<CompiledPDFPasswordInput {...props} />
	) : (
		<EmotionPDFPasswordInput {...props} />
	);
