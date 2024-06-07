import styled from '@emotion/styled';

// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-styled -- To migrate as part of go/ui-styling-standard
export const Matrix = styled.table({
	thead: {
		td: {
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: '20px',
		},
	},
	tbody: {
		td: {
			padding: '25px 10px',
		},
	},
	td: {
		margin: 'auto',
		textAlign: 'center',
		verticalAlign: 'middle',
		'&:first-child': {
			fontWeight: 'bold',
			fontSize: '20px',
		},
		'> div': {
			display: 'flex',
			justifyContent: 'center',
			textAlign: 'left',
		},
	},
});
