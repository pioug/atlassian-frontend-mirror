import type { UserPickerSession } from './analytics';

export function sessionId(session?: UserPickerSession): any {
	return session && session.id;
}
