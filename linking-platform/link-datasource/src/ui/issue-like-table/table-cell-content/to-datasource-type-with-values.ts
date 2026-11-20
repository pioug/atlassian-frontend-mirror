import type {
	DatasourceDataResponseItem,
	DatasourceType,
	User,
} from '@atlaskit/linking-types/datasource';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import { type DatasourceTypeWithOnlyValues } from '../types';

const PEOPLE_TYPE_ID_SUFFIX = ':12';
const TAG_DEFAULT_TYPE_SUFFIX = ':0:12';

type DatasourceRowData = {
	[key: string]: {
		data?: DatasourceDataResponseItem[string]['data'] | null | undefined;
	};
};

const isUserShapedValue = (value: unknown): value is User =>
	typeof value === 'object' && value !== null && !Array.isArray(value) && 'displayName' in value;

const isPeopleColumnKey = (columnKey: string): boolean =>
	columnKey.endsWith(PEOPLE_TYPE_ID_SUFFIX) && !columnKey.endsWith(TAG_DEFAULT_TYPE_SUFFIX);

/**
 * Maps a `/data` cell onto a render type.
 *
 * Assets People attributes currently ship as string ARIs (`type: "string"`). The gated LoL
 * payload switches them to hydrated `{displayName, avatarSource}` objects (`type: "user"`).
 * Coerce both shapes so Confluence macros keep working while the BE rolls out.
 */
export const toDatasourceTypeWithValues = ({
	rowData,
	columnKey,
	columnType,
}: {
	columnKey: string;
	columnType: DatasourceType['type'];
	rowData: DatasourceRowData;
}): DatasourceTypeWithOnlyValues => {
	const value = rowData[columnKey]?.data;
	// Missing/null cells stay empty so user columns do not render an Unassigned chip.
	// Keep other falsy values (0, '', false) as a one-element array, matching the
	// previous ReadOnlyCell wrapping for numeric/boolean/string cells.
	const values =
		value === null || value === undefined ? [] : Array.isArray(value) ? value : [value];

	if (!fg('assets_tempeh_lol_people_user')) {
		return {
			type: columnType,
			values,
		} as DatasourceTypeWithOnlyValues;
	}

	if (
		(columnType === 'user' || isPeopleColumnKey(columnKey)) &&
		values.length > 0 &&
		values.every(isUserShapedValue)
	) {
		return {
			type: 'user',
			values,
		};
	}

	if (
		(columnType === 'user' || isPeopleColumnKey(columnKey)) &&
		values.length > 0 &&
		values.every((item) => typeof item === 'string')
	) {
		return {
			type: 'user',
			values: values.map((ari) => ({ displayName: ari })),
		};
	}

	return {
		type: columnType,
		values,
	} as DatasourceTypeWithOnlyValues;
};
