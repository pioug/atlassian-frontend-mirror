import React from 'react';
import { PDFRendererWrapper as CompiledPDFRendererWrapper } from './pdfRendererWrapper-compiled';

export const PDFRendererWrapper = (props: { children: React.ReactNode }) => (
	<CompiledPDFRendererWrapper {...props} />
);
