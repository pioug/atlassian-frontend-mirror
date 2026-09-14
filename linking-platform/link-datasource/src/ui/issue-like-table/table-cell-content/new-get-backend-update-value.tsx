import type { DatasourceTypeWithOnlyValues } from '../types';

/**
 * @returns String of the new field value, or ID of status transition / atlassian user ID / priority ID.
 * @throws Error if the value is not supplied.
 */
export const newGetBackendUpdateValue = (typedNewValue: DatasourceTypeWithOnlyValues): string => {
	if (typedNewValue.values.length === 0) {
		throw new Error(
			`Datasource 2 way sync: Backend update value or value ID not supplied for type ${typedNewValue.type}`,
		);
	}
	switch (typedNewValue.type) {
		case 'string':
			return typedNewValue.values[0];
		case 'status':
			const { transitionId } = typedNewValue.values[0];
			if (transitionId === undefined || transitionId === '') {
				throw new Error(
					`Datasource 2 way sync: Backend status transition ID not supplied for type transition`,
				);
			}
			return transitionId;
		case 'user':
			const { atlassianUserId } = typedNewValue.values[0];
			if (atlassianUserId === undefined || atlassianUserId === '') {
				throw new Error(
					`Datasource 2 way sync: Backend atlasian user ID not supplied for type user`,
				);
			}
			return atlassianUserId;
		case 'icon':
			const { id } = typedNewValue.values[0];
			if (id === undefined || id === '') {
				throw new Error(`Datasource 2 way sync: Backend update ID not supplied for type icon`);
			}
			return id;
	}
	throw new Error(
		`Datasource 2 way sync Backend update value not implemented for type ${typedNewValue.type}`,
	);
};
