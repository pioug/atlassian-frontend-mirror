import type { UserPickerSession } from './analytics';

export function downKeyCount(session?: UserPickerSession): any {
	return session ? session.downCount : null;
}
