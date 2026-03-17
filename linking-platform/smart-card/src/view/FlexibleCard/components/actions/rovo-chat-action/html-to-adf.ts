/**
 * This is a simplified version of html to adf conversion,
 * used specifically for SL RovoChatAction prompt message,
 * and does not support all ADF offered via @atlaskit/adf-utils
 *
 * Support: p, ul, li, text, b, strong, code, inlineCard (replace a hyperlink)
 */
import { code, doc, inlineCard, p, b, ul, li, text } from '@atlaskit/adf-utils/builders';

type HTMLToken =
	| { content?: string[]; tagName?: string; type: 'close' | 'open' | 'selfClosing' }
	| { content?: string; type: 'text' };

const INLINE_TAG_NAMES = ['b', 'strong', 'code', 'a', 'inlineCard'];
const BLOCK_TAG_NAMES = ['p', 'ul', 'ol', 'li'];

/**
 *   Group      Captures                Example
 *  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *   match[1]   Self-closing tag name   br from <br/> or <img src="x"/>
 *   match[2]   Opening tag name        div from <div> or <div class="x">
 *   match[3]   Closing tag name        div from </div>
 *   match[4]   Text content            Hello world
 */
const htmlRegex = /<\s*(\w+)[^>]*?\s*\/\s*>|<\s*(\w+)[^>]*>|<\s*\/\s*(\w+)\s*>|([^<]+)/g;

const decodeHtmlEntities = (text: string = ''): string => {
	return text
		.replace(/&nbsp;/g, ' ')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
};

const tokenizeHtml = (html: string): HTMLToken[] => {
	const tokens: HTMLToken[] = [];
	let match;

	while ((match = htmlRegex.exec(html)) !== null) {
		const selfClosingTag = match[1];
		const openingTag = match[2];
		const closingTag = match[3];
		const textContent = match[4];

		if (selfClosingTag) {
			tokens.push({
				type: 'selfClosing',
				tagName: selfClosingTag.toLowerCase(),
			});
		} else if (openingTag) {
			tokens.push({
				type: 'open',
				tagName: openingTag.toLowerCase(),
			});
		} else if (closingTag) {
			tokens.push({
				type: 'close',
				tagName: closingTag.toLowerCase(),
			});
		} else if (textContent) {
			if (textContent?.trim()) {
				tokens.push({
					type: 'text',
					content: decodeHtmlEntities(textContent),
				});
			}
		}
	}

	return tokens;
};

const buildListItem = (content: [] = []) => {
	// Check if content has only text/inline elements
	const hasOnlyInlineContent = content.every(
		(node: { type: string }) => node.type === 'text' || node.type === 'hardBreak' || !node.type,
	);

	if (hasOnlyInlineContent) {
		// Wrap text content in a paragraph
		return li([p(...content)]);
	}

	// Content has block elements (like nested lists), use as-is
	return li(content as never);
};

const blockToAdf = (tagName?: string, content: [] = []) => {
	switch (tagName) {
		case 'p':
			return p(...content);
		case 'ul':
			return ul(...content);
		case 'li':
			return buildListItem(content);
	}
};

const inlineToAdf = (tagName: string, content: string) => {
	switch (tagName) {
		case 'b':
		case 'strong':
			return b(content);
		case 'code':
			return code(content);
		case 'a':
		case 'inlineCard':
			return inlineCard({ url: content });
		default:
			return text(content);
	}
};

const parseTokensToAdf = (tokens: HTMLToken[]) => {
	const stack: { content: []; type: string }[] = [{ type: 'root', content: [] }];
	let currentMarks: { type: string }[] = [];

	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		const current = stack[stack.length - 1];

		switch (token.type) {
			case 'text':
				if (token.content) {
					const inlineAdfNode = inlineToAdf(currentMarks?.[0]?.type, token.content);
					current.content.push(inlineAdfNode as never);
				}
				break;
			case 'open':
				if (INLINE_TAG_NAMES.includes(token.tagName!)) {
					currentMarks.push({ type: token.tagName! });
				} else if (BLOCK_TAG_NAMES.includes(token.tagName!)) {
					stack.push({ type: token.tagName!, content: [] });
				}
				break;
			case 'close':
				// Inline formatting
				if (token.tagName && INLINE_TAG_NAMES.includes(token.tagName)) {
					currentMarks = currentMarks.filter((m) => m.type !== token.tagName);
				}
				// Block elements
				else if (stack.length > 1) {
					const closed = stack.pop();
					const parent = stack[stack.length - 1];

					const adfNode = blockToAdf(closed?.type, closed?.content);
					if (adfNode) {
						parent.content.push(adfNode as never);
					}
				}
				break;
		}
	}

	// Return root content
	return stack[0].content;
};

/**
 * Convert HTML string to ADF format
 *
 * This is a simplified version specific for RovoChatAction prompt message
 * and does not support all ADF offered via @atlaskit/adf-utils
 */
const htmlToAdf = (html: string) => {
	try {
		const tokens = tokenizeHtml(html);
		const adfContent = parseTokensToAdf(tokens);

		return doc(...adfContent);
	} catch {
		return html;
	}
};

export default htmlToAdf;
