const ENDS_WITH_DOT = /\.$/;

export type Matcher = string | RegExp | ((name: string) => boolean) | '*';

function matchEvent(matcher: Matcher, name: string): boolean {
	if (matcher === '*' || name === undefined) {
		return true;
	}
	if (typeof matcher === 'string') {
		if (ENDS_WITH_DOT.test(matcher)) {
			return name.substr(0, matcher.length) === matcher;
		}
		return name === matcher;
	}
	if (typeof matcher === 'function') {
		return matcher(name);
	}
	return matcher.test(name);
}

export default matchEvent;
