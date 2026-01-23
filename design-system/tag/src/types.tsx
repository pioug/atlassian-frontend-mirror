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

/**
 * @internal
 * Temporary prop type for Lozenge → Tag migration.
 * When `migration_fallback` is set to `'lozenge'` and the feature flag
 * `platform-dst-lozenge-tag-badge-visual-uplifts` is OFF, the Tag component
 * will render as a Lozenge instead.
 *
 * This type will be removed via codemod after migration is complete.
 */
export type MigrationFallback = 'lozenge';
