export const filterAndSortMarks = (marks: string, excluded: string[] = []) => {
	return marks
		.split(' ')
		.filter((v) => !excluded.includes(v))
		.sort()
		.join(' ');
};

/**
 * filter out the unsupported nodes in content expression
 * @param skipLists list includes node name need to be excluded
 * @returns content without node name defined in skipList
 */
const unSupportedExp =
	(skipLists: string[] = []) =>
	(str: string) => {
		// this is used to treat cases like 'unsupportedBlock*'
		if (str.endsWith('*')) {
			return !skipLists.includes(str.substring(0, str.length - 1));
		}
		if (str.endsWith('+')) {
			return !skipLists.includes(str.substring(0, str.length - 1));
		}
		return !skipLists.includes(str);
	};

/**
 * Sort the nodes in (), and also exclude the node if matched in skipList
 * @param input content expression, e.g. "(paragrah | heading)"
 * @param skipLists a list defined node name can be removed from content expression.
 * @param enableWrap flag to add back ()
 * @returns
 */
const sortAndFilterOrsExp = (input: string, skipLists: string[] = [], enableWrap = false) => {
	const filteredOr = input.split('|').filter(unSupportedExp(skipLists));
	if (filteredOr.length === 1) {
		return `${filteredOr[0]}`;
	}
	if (enableWrap) {
		return `(${filteredOr.sort().join('|')})`;
	}
	return `${filteredOr.sort().join('|')}`;
};

/**
 * Find the string inside () of provided string
 * @param inputString input string likely have () in it
 * @returns
 */
function findStringInParentheses(inputString: string) {
	const regex = /\((.*?)\)/gu;
	const matches = inputString.match(regex);
	if (matches) {
		return matches.map((match) => match.replace('(', '').replace(')', ''));
	} else {
		return null;
	}
}

/**
 * Format the content expression
 * @param exp content expression string, e.g. (aTest, bTest)+
 * @param operatorStart could be {, +, *
 * @param skipLists
 * @returns sorted and removed node defined in skipList
 */
function formatExp(exp: string, operatorStart = '', skipLists: string[] = []) {
	const orEnd = exp.indexOf(operatorStart);
	const suffix = exp.substring(orEnd);
	const matches = findStringInParentheses(exp);
	if (matches) {
		const temp = sortAndFilterOrsExp(matches[0], skipLists);
		if (temp.includes('|')) {
			return `(${temp})${suffix}`;
		}
		return `${temp}${suffix}`;
	}
	return sortAndFilterOrsExp(exp, skipLists);
}

const expFormatter =
	(skipLists: string[] = []) =>
	(content: string) => {
		if (content.includes('|')) {
			if (content.endsWith('}')) {
				return formatExp(content, '{', skipLists);
			}
			if (content.endsWith('+')) {
				return formatExp(content, '+', skipLists);
			}
			if (content.endsWith('*')) {
				return formatExp(content, '*', skipLists);
			}
			if (!content.includes('+') && !content.includes('*')) {
				if (content.startsWith('(') && content.endsWith(')')) {
					const temp = content.substring(1, content.length - 1);
					return `(${sortAndFilterOrsExp(temp, skipLists)})`;
				}
				return sortAndFilterOrsExp(content, skipLists);
			}
		}
		return sortAndFilterOrsExp(content, skipLists);
	};

/**
 * Sort the node inside of () in contents string,
 * remove spaces around '|', because there were inconsistence in legacy PM schema
 * remove not supported nodes defined in skipList
 * @param content contents string, e.g. (aTest | bTest)+ (cTest | dTest)*
 * @param skipLists a list contains node name can be removed from contents string
 * @returns sorted content string, without node defined in skipList
 */
export const formatContent = (content: string, skipLists: string[] = []) => {
	const result = content.replace(/\s*\|\s*/gu, '|');
	if (result.includes(' ')) {
		return result.split(' ').map(expFormatter(skipLists)).join(' ').trim();
	}
	return expFormatter(skipLists)(result).trim();
};
