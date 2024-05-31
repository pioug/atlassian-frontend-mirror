import { changeImportEntryPoint } from '@atlaskit/codemod-utils';
import type { EntryPointChangeRequest, EntryPointChangeMigrates } from '../types/entry-points';

export const createMigratesFromEntryPointChangeRequests = (
	changeRequests: EntryPointChangeRequest[],
) => {
	const entryPointChangeMigrates: EntryPointChangeMigrates = [];
	changeRequests.forEach(
		({ importSpecifiers, oldEntryPointsToRemove, newEntryPoint, shouldBeTypeImport }) => {
			oldEntryPointsToRemove.forEach((oldEntryPoint) => {
				importSpecifiers.forEach((importSpecifier) => {
					entryPointChangeMigrates.push(
						changeImportEntryPoint(
							oldEntryPoint,
							importSpecifier,
							newEntryPoint,
							shouldBeTypeImport,
						),
					);
				});
			});
		},
	);
	return entryPointChangeMigrates;
};
