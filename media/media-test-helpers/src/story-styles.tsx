import styled from '@emotion/styled';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled, @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const Matrix = styled.table({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	thead: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		td: {
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: '20px',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	tbody: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		td: {
			padding: '25px 10px',
		},
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	td: {
		margin: 'auto',
		textAlign: 'center',
		verticalAlign: 'middle',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
		'&:first-child': {
			fontWeight: 'bold',
			fontSize: '20px',
		},
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'> div': {
			display: 'flex',
			justifyContent: 'center',
			textAlign: 'left',
		},
	},
});
