/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import type { ReactNode } from 'react';

// Styles are partially copied from https://github.com/mozilla/pdfjs-dist/blob/v2.9.359/web/pdf_viewer.css
/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
const globalStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.pdfViewer': {
		marginTop: token('space.800', '64px'),
		marginBottom: token('space.800', '64px'),
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.page': {
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-space
			marginTop: '1px',
			marginRight: 'auto',
			marginBottom: `${token('space.negative.100', '-8px')}`,
			marginLeft: 'auto',
			borderColor: 'transparent',
			borderWidth: '9px',
			borderStyle: 'solid',
			position: 'relative',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.canvasWrapper': {
			overflow: 'hidden',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.textLayer': {
			position: 'absolute',
			left: 0,
			top: 0,
			right: 0,
			bottom: 0,
			overflow: 'hidden',
			opacity: 0.2,
			// eslint-disable-next-line @atlaskit/design-system/use-tokens-typography
			lineHeight: 1,
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.textLayer span, .textLayer br': {
			color: 'transparent',
			position: 'absolute',
			whiteSpace: 'pre',
			cursor: 'text',
			transformOrigin: '0% 0%',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'.textLayer ::-moz-selection': {
			background: 'rgba(0, 0, 255, 1)',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.textLayer ::selection': {
			background: 'rgba(0, 0, 255, 1)',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.annotationLayer section': {
			position: 'absolute',
			textAlign: 'initial',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.annotationLayer .linkAnnotation > a, .annotationLayer .buttonWidgetAnnotation.pushButton > a':
			{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
			},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'.annotationLayer .linkAnnotation > a:hover, .annotationLayer .buttonWidgetAnnotation.pushButton > a:hover':
			{
				opacity: 0.2,
				background: 'rgba(255, 255, 0, 1)',
				boxShadow: '0 2px 10px rgba(255, 255, 0, 1)',
			},
	},
});

export const PDFRendererWrapper = ({ children }: { children: ReactNode }) => (
	<div css={globalStyles}>{children}</div>
);
