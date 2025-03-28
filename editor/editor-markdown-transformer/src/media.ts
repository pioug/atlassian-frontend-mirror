export type Token = {
	new (type: string, tag: string, level: number): Token;
	type: string;
	content: string;
	level: number;
	tag: string;
	attrs?: string[][];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	children?: any[];
};

export interface MdState {
	Token: Token;
	tokens: Token[];
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	md: any;
}

function createRule() {
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	const regx = /!\[([^\]]*)\]\(([^)]*?)\s*(?:"([^")]*)"\s*)?\)/g;
	const validParentTokens = ['th_open', 'td_open', 'list_item_open', 'blockquote_open'];

	/**
	 * This function looks for strings that matches ![description](url) inside Inline-tokens.
	 * It will then split the Inline-token with content before and after the image, example:
	 *
	 * Input (tokens):
	 *   paragraph_open
	 *   inline - content: Hello ![](image.jpg) World!
	 *   paragraph_close
	 * Output (tokens):
	 *   paragraph_open
	 *   inline - content: Hello
	 *   paragraph_close
	 *   media_single_open
	 *   media
	 *   media_single_close
	 *   paragraph_open
	 *   inline - content: World!
	 *   paragraph_close
	 *
	 * This is applied before the inline content is parsed, to ensure that the formatting of
	 * remaining inline content (bold, links, etc.) is kept intact!
	 */
	return function media(State: MdState) {
		const getUrl = (str: string) => {
			const res = State.md.helpers.parseLinkDestination(str, str.indexOf('(') + 1, str.length);
			if (res.ok) {
				const href = State.md.normalizeLink(res.str);
				if (State.md.validateLink(href)) {
					return href;
				}
			}

			return '';
		};

		const createMediaTokens = (url: string, alt: string = '') => {
			const mediaSingleOpen = new State.Token('media_single_open', '', 1);
			const media = new State.Token('media', '', 0);
			media.attrs = [
				['url', getUrl(url)],
				['type', 'external'],
				['alt', alt],
			];
			const mediaSingleClose = new State.Token('media_single_close', '', -1);

			return [mediaSingleOpen, media, mediaSingleClose];
		};

		const createInlineTokens = (str: string, openingTokens: Token[], closingTokens: Token[]) => {
			if (!str || str.length === 0) {
				return [];
			}

			const inlineBefore = new State.Token('inline', '', 1);
			inlineBefore.content = str;
			inlineBefore.children = [];

			return [...openingTokens, inlineBefore, ...closingTokens];
		};

		let processedTokens: string[] = [];
		const newTokens = State.tokens.reduce(
			(tokens: Token[], token: Token, i: number, arr: Token[]) => {
				const matchAll = Array.from(token.content.matchAll(regx));
				if (token.type === 'inline' && matchAll.length) {
					const openingTokens: Token[] = [];
					let cursor = i - 1;
					let previousToken = arr[cursor];
					let subTree: Token[] = [];

					while (
						previousToken &&
						previousToken.level > 0 &&
						validParentTokens.indexOf(previousToken.type) === -1
					) {
						openingTokens.unshift(previousToken);
						cursor--;
						previousToken = arr[cursor];
					}

					if (validParentTokens.indexOf(previousToken.type) === -1) {
						openingTokens.unshift(previousToken);
					} else {
						cursor++;
					}

					const closingTokens = openingTokens
						.map((token) => new State.Token(token.type.replace('_open', '_close'), token.tag, -1))
						.reverse();

					let inlineContentStack = token.content;

					matchAll.forEach((match, j) => {
						const [matchString, alt, url] = match;
						const start = inlineContentStack.indexOf(matchString);
						const contentBefore = inlineContentStack.substr(0, start);
						inlineContentStack = inlineContentStack.substr(start + matchString.length);

						subTree = [
							...subTree,
							...createInlineTokens(contentBefore, openingTokens, closingTokens),
							...createMediaTokens(url, alt),
						];
					});
					if (inlineContentStack.length) {
						subTree = [
							...subTree,
							...createInlineTokens(inlineContentStack, openingTokens, closingTokens),
						];
					}

					processedTokens = [...processedTokens, ...closingTokens.map((c) => c.type)];

					tokens = [...tokens.slice(0, cursor), ...subTree];
				} else if (processedTokens.indexOf(token.type) !== -1) {
					// Ignore token if it's already processed
					processedTokens.splice(processedTokens.indexOf(token.type), 1);
				} else {
					tokens.push(token);
				}

				return tokens;
			},
			[],
		);

		State.tokens = newTokens;
		return true;
	};
}

// Ignored via go/ees005
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const markdownItMedia = (md: any) => {
	md.core.ruler.before('inline', 'media', createRule());
};
