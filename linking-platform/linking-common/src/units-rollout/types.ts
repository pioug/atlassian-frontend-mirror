/**
 * Where an organisation is in the units migration, as reported by AGG.
 *
 * The two are separate steps and both matter: an organisation is first launched, and boundary
 * enforcement is turned on afterwards. Only when both are true are users restricted to their own
 * unit, and only then do we have to call the unit compliant endpoints.
 */
export interface UnitsRolloutSettings {
	/** Unit boundaries are enforced, so a user may only see the sites in their own unit. */
	boundaryEnforced: boolean;
	/** The organisation has been launched onto units for its end users. */
	endUsersLaunched: boolean;
}
