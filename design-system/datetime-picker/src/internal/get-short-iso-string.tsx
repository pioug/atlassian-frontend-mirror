// oxlint-disable-next-line @atlassian/no-restricted-imports
import { format } from 'date-fns';

import { convertTokens } from './parse-tokens';

export function getShortISOString(date: Date): string {
	return format(date, convertTokens('YYYY-MM-DD'));
}
