import React from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import { PDFRendererWrapper as CompiledPDFRendererWrapper } from './pdfRendererWrapper-compiled';
import { PDFRendererWrapper as EmotionPDFRendererWrapper } from './pdfRendererWrapper-emotion';

export const PDFRendererWrapper = (props: { children: React.ReactNode }) =>
	fg('platform_media_compiled') ? (
		<CompiledPDFRendererWrapper {...props} />
	) : (
		<EmotionPDFRendererWrapper {...props} />
	);
