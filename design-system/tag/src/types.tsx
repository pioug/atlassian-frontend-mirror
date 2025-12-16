export type TagColor =
	| 'standard'
	| 'green'
	| 'lime'
	| 'blue'
	| 'red'
	| 'purple'
	| 'magenta'
	| 'grey'
	| 'gray'
	| 'teal'
	| 'orange'
	| 'yellow'
	| undefined
	// All colors below to be removed with the labelling system work
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

// To be removed with the labelling system work
// eslint-disable-next-line @repo/internal/react/consistent-types-definitions
export type AppearanceType = 'default' | 'rounded';
