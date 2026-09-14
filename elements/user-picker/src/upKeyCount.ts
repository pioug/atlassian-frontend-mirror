import type { UserPickerSession } from './analytics';

export function upKeyCount(session?: UserPickerSession): any {
	return session ? session.upCount : null;
}
