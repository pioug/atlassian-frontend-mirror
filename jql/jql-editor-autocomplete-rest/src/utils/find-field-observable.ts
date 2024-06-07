import type { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators/filter';
import { take } from 'rxjs/operators/take';

import { type JQLFieldResponse } from '../common/types';

import { areStringsEquivalent, normalize } from './strings';

/**
 * Returns an Observable of the first field matching the provided string, or an empty Observable if no matching field
 * could be found.
 */
const findField$ = (
	jqlFields$: Observable<JQLFieldResponse>,
	field: string,
): Observable<JQLFieldResponse> => {
	return jqlFields$.pipe(
		filter(({ value }) => {
			const normalizedField = normalize(field);
			const normalizedValue = normalize(value);
			return areStringsEquivalent(normalizedField, normalizedValue);
		}),
		take(1),
	);
};

export default findField$;
