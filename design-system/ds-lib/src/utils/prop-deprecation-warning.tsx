import warnOnce from './warn-once';

export function propDeprecationWarning(
	packageName: string,
	propName: string,
	predicate: boolean,
	deprecationAnnouncementOnDAC: string,
): void {
	if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development' && predicate) {
		warnOnce(
			`[${packageName}]: The ${propName} prop is deprecated and will be removed, please migrate away.
Public announcement: ${deprecationAnnouncementOnDAC}`,
		);
	}
}
