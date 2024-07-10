export type TagColor =
	| 'standard'
	| 'green'
	| 'lime'
	| 'blue'
	| 'red'
	| 'purple'
	| 'magenta'
	| 'grey'
	| 'teal'
	| 'orange'
	| 'yellow'
	| undefined
	// All colors below to be removed with platform-component-visual-refresh (BLU-2992)
	| 'limeLight'
	| 'orangeLight'
	| 'magentaLight'
	| 'greenLight'
	| 'blueLight'
	| 'redLight'
	| 'purpleLight'
	| 'greyLight'
	| 'tealLight'
	| 'yellowLight';

// To be removed with platform-component-visual-refresh (BLU-2992)
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type AppearanceType = 'default' | 'rounded';
