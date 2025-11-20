import React from 'react';
import { PDFRendererWrapper as CompiledPDFRendererWrapper } from './pdfRendererWrapper-compiled';

export const PDFRendererWrapper = (props: { children: React.ReactNode }): React.JSX.Element => (
	<CompiledPDFRendererWrapper {...props} />
);
