import type { UserPickerSession } from './analytics';

export function sessionDuration(session?: UserPickerSession): any {
	return session ? Date.now() - session.start : null;
}
