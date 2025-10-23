/* eslint-disable require-unicode-regexp */
// File has been copied to packages/editor/editor-plugin-ai/src/provider/prosemirror-transformer/utils/utils.ts
// If changes are made to this file, please make the same update in the linked file.

/**
 * A replacement for `String.repeat` until it becomes widely available.
 */
export function stringRepeat(text: string, length: number): string {
	let result = '';
	for (let x = 0; x < length; x++) {
		result += text;
	}
	return result;
}

/**
 * This function escapes all plain-text sequences that might get converted into markdown
 * formatting by Bitbucket server (via python-markdown).
 * @see MarkdownSerializerState.esc()
 */
export function escapeMarkdown(str: string, startOfLine?: boolean, insideTable?: boolean): string {
	let strToEscape = str || '';
	// Ignored via go/ees005
	// eslint-disable-next-line require-unicode-regexp
	strToEscape = strToEscape.replace(/[`*\\+_()\[\]{}]/g, '\\$&');
	if (startOfLine) {
		strToEscape = strToEscape
			// Ignored via go/ees005
			// eslint-disable-next-line require-unicode-regexp
			.replace(/^[#-&(-*]/, '\\$&') // Don't escape ' character
			// Ignored via go/ees005
			.replace(/^(\d+)\./, '$1\\.');
	}
	if (insideTable) {
		// Ignored via go/ees005
		strToEscape = strToEscape.replace(/[|]/g, '\\$&');
	}
	return strToEscape;
}

/**
 * Safely escape text for HTML attribute values
 */
export function escapeHtmlAttribute(text: string): string {
	if (!text) {
		return text;
	}
	return text
		// HTML/meta
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		// Markdown punctuation that risks interpretation by backend attr_list / python-markdown
		.replace(/\*/g, '&#42;')
		.replace(/_/g, '&#95;')
		.replace(/`/g, '&#96;')
		.replace(/~/g, '&#126;')
		.replace(/\|/g, '&#124;')
		.replace(/\{/g, '&#123;')
		.replace(/\}/g, '&#125;')
		.replace(/\[/g, '&#91;')
		.replace(/\]/g, '&#93;')
		.replace(/\(/g, '&#40;')
		.replace(/\)/g, '&#41;')
		.replace(/!/g, '&#33;');
}

/**
 * Safely unescape HTML attribute values back to text
 */
export function unescapeHtmlAttribute(text: string): string {
	if (!text) {
		return text;
	}
	return text
		// HTML/meta
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, '\'')
		// Markdown punctuation we may have entity-encoded
		.replace(/&#42;/g, '*')
		.replace(/&#95;/g, '_')
		.replace(/&#96;/g, '`')
		.replace(/&#126;/g, '~')
		.replace(/&#124;/g, '|')
		.replace(/&#123;/g, '{')
		.replace(/&#125;/g, '}')
		.replace(/&#91;/g, '[')
		.replace(/&#93;/g, ']')
		.replace(/&#40;/g, '(')
		.replace(/&#41;/g, ')')
		.replace(/&#33;/g, '!')
		// Ampersand must be last
		.replace(/&amp;/g, '&');
}

/**
 * Escape a string intended for use inside python-markdown's attr_list values
 * This combines safe HTML attribute escaping with entity-encoding of markdown
 * punctuation that could be interpreted by the backend (e.g. **, _, `, ~, etc.).
 */
// Pre-compiled regex patterns for performance - compiled once, used many times
const MARKDOWN_PATTERNS = {
	bold: /\*\*([^*]+)\*\*/g,
	italic: /_([^_]+)_/g,
	strikethrough: /~~([^~]+)~~/g,
	code: /`([^`]+)`/g,
} as const;

/**
 * Parse markdown formatting using pre-compiled regex patterns
 * This is more efficient than creating regex patterns every time
 * and safer than manual string replacement
 */
export function parseMarkdownFormatting(text: string): string {
	return text
		.replace(MARKDOWN_PATTERNS.bold, '<strong>$1</strong>')
		.replace(MARKDOWN_PATTERNS.italic, '<em>$1</em>')
		.replace(MARKDOWN_PATTERNS.strikethrough, '<s>$1</s>')
		.replace(MARKDOWN_PATTERNS.code, '<code>$1</code>');
}

// Ignored via go/ees005
// eslint-disable-next-line require-unicode-regexp
const SPECIAL_CHARACTERS = /\u200c|↵/g;
function removeSpecialCharacters(node: Node) {
	if (node.nodeType === 3 && node.textContent) {
		node.textContent = node.textContent.replace(SPECIAL_CHARACTERS, '');
	}

	Array.from(node.childNodes).forEach((child) => removeSpecialCharacters(child));
}

function parseContent(text: string): { body: string; title: string } | null {
	const newlineIndex = text.indexOf('\n');

	if (newlineIndex === -1) {
		// skip rendering the expand if it doesn’t have multiple lines
		return null;
	}

	const title = text.substring(0, newlineIndex).trim();
	const body = text.substring(newlineIndex + 1).trim();

	if (!body || body.length === 0) {
		return null;
	}

	return {
		title,
		body,
	};
}

/**
 * This function gets markup rendered by Bitbucket server and transforms it into markup that
 * can be consumed by Prosemirror HTML parser, conforming to our schema.
 */
export function transformHtml(
	html: string,
	options: {
		disableBitbucketLinkStripping?: boolean;
		shouldParseCaptions?: boolean;
		shouldParseCodeSuggestions?: boolean;
		shouldParseImageResizingAttributes?: boolean;
	},
): HTMLElement {
	const el = document.createElement('div');
	el.innerHTML = html;

	// Remove zero-width-non-joiner
	Array.from(el.querySelectorAll('p')).forEach((p: HTMLParagraphElement) => {
		removeSpecialCharacters(p);
	});

	if (options.shouldParseCodeSuggestions) {
		// convert suggestion code block to a suggestion div
		Array.from(el.querySelectorAll('div.language-suggestion')).forEach(function (div, index) {
			// convert to suggestion view mode extension
			const suggestionDiv = document.createElement('div');
			suggestionDiv.setAttribute('data-node-type', 'extension');
			suggestionDiv.setAttribute('data-extension-type', 'com.atlassian.bbc.code-suggestions');
			suggestionDiv.setAttribute('data-extension-key', 'codesuggestions:suggestion-node');
			suggestionDiv.setAttribute('data-local-id', index.toString());
			// remove trailing newline from suggestion text
			// @ts-ignore - TS1501 TypeScript 5.9.2 upgrade
			const suggestionText = div.textContent ? div.textContent.replace(/\n$/, '') : '';
			suggestionDiv.setAttribute(
				'data-parameters',
				JSON.stringify({
					suggestionIndex: index,
					suggestionText: suggestionText,
					extensionTitle: 'Suggesting',
				}),
			);
			if (div.parentNode) {
				div.parentNode.insertBefore(suggestionDiv, div);
				div.parentNode.removeChild(div);
			}
		});
	}

	// convert expand code block to a expand panel
	Array.from(el.querySelectorAll('div.language-expand')).forEach(function (div) {
		const parsedResult = parseContent(div.textContent || '');

		if (div.parentNode) {
			if (parsedResult) {
				const expandDiv = document.createElement('div');
				expandDiv.setAttribute('data-node-type', 'expand');
				expandDiv.setAttribute('data-title', parsedResult.title);
				expandDiv.setAttribute('data-expanded', 'false');

				parsedResult.body.split('\n').forEach(function (line) {
					if (!line.trim()) {
						return;
					}

					const p = document.createElement('p');
					p.textContent = line;
					expandDiv.appendChild(p);
				});

				div.parentNode.insertBefore(expandDiv, div);
			}
			div.parentNode.removeChild(div);
		}
	});

	// Convert mention containers, i.e.:
	//   <a href="/abodera/" rel="nofollow" title="@abodera" class="mention mention-me">Artur Bodera</a>
	Array.from(el.querySelectorAll<HTMLLinkElement>('a.mention, a.ap-mention')).forEach(
		(a: HTMLLinkElement) => {
			const span = document.createElement('span');
			span.setAttribute('class', 'editor-entity-mention');
			span.setAttribute('contenteditable', 'false');

			const atlassianId = a.getAttribute('data-atlassian-id') || '';
			if (atlassianId) {
				// Atlassian ID is wrapped in curlies so that it get serialized as @{aid-id} instead of @aid-id
				span.setAttribute('data-mention-id', `{${atlassianId}}`);
			} else {
				const title = a.getAttribute('title') || '';
				if (title) {
					// Ignored via go/ees005
					// eslint-disable-next-line require-unicode-regexp
					const usernameMatch = title.match(/^@(.*?)$/);
					if (usernameMatch) {
						const username = usernameMatch[1];
						span.setAttribute('data-mention-id', username);
					}
				}
			}

			const text = a.textContent || '';
			if (text.indexOf('@') === 0) {
				span.textContent = a.textContent;
			} else {
				span.textContent = `@${a.textContent}`;
			}

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			a.parentNode!.insertBefore(span, a);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			a.parentNode!.removeChild(a);
		},
	);

	// Convert mention containers, i.e.:
	//   <span class="ap-mention" data-atlassian-id="5c09bf77ec71bd223bbe866f">@Scott Demo</span>
	Array.from(el.querySelectorAll<HTMLSpanElement>('span.ap-mention')).forEach(
		(s: HTMLSpanElement) => {
			const span = document.createElement('span');
			span.setAttribute('class', 'editor-entity-mention');
			span.setAttribute('contenteditable', 'false');

			const atlassianId = s.getAttribute('data-atlassian-id') || '';
			span.setAttribute('data-mention-id', `{${atlassianId}}`);

			const text = s.textContent || '';
			span.textContent = text.indexOf('@') === 0 ? text : `@${text}`;

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			s.parentNode!.insertBefore(span, s);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			s.parentNode!.removeChild(s);
		},
	);

	// Parse emojis i.e.
	//     <img src="https://d301sr5gafysq2.cloudfront.net/207268dc597d/emoji/img/diamond_shape_with_a_dot_inside.svg" alt="diamond shape with a dot inside" title="diamond shape with a dot inside" class="emoji">
	Array.from(el.querySelectorAll<HTMLImageElement>('img.emoji')).forEach(
		(img: HTMLImageElement) => {
			const span = document.createElement('span');
			let shortName = img.getAttribute('data-emoji-short-name') || '';

			if (!shortName) {
				// Fallback to parsing Bitbucket's src attributes to find the
				// short name
				const src = img.getAttribute('src');
				// Ignored via go/ees005
				// eslint-disable-next-line require-unicode-regexp
				const idMatch = !src ? false : src.match(/([^\/]+)\.[^\/]+$/);

				if (idMatch) {
					shortName = `:${decodeURIComponent(idMatch[1])}:`;
				}
			}

			if (shortName) {
				span.setAttribute('data-emoji-short-name', shortName);
			}

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			img.parentNode!.insertBefore(span, img);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			img.parentNode!.removeChild(img);
		},
	);

	if (!options.disableBitbucketLinkStripping) {
		// Convert all automatic links to plain text, because they will be re-created on render by the server
		Array.from(el.querySelectorAll('a'))
			// Don't convert external links (i.e. not automatic links)
			.filter(
				(a: HTMLAnchorElement) =>
					a.getAttribute('data-is-external-link') !== 'true' &&
					a.getAttribute('data-inline-card') === null,
			)
			.forEach((a: HTMLAnchorElement) => {
				Array.from(a.childNodes).forEach((child) => {
					// Ignored via go/ees005
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					a.parentNode!.insertBefore(child, a);
				});
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				a.parentNode!.removeChild(a);
			});
	}

	// Parse images
	// Not using :pseudo because of IE11 bug:
	// https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/16104908/
	Array.from(el.querySelectorAll('img'))
		.filter((img) => !img.classList.contains('emoji'))
		.forEach((img: HTMLImageElement) => {
			const { parentNode } = img;

			if (!parentNode) {
				return;
			}

			// Parse caption BEFORE potentially lifting the image node
			// This ensures we can still find the figcaption when the image is inside a figure
			let captionText = '';
			if (options.shouldParseCaptions) {
				// Option 1: Check for figcaption sibling (if img is inside figure)
				const figure = img.closest('figure');
				if (figure) {
					const figcaption = figure.querySelector('figcaption');
					if (figcaption) {
						captionText = figcaption.textContent || '';
					}
				}

				// Option 2: Check for title attribute
				if (!captionText && img.getAttribute('title')) {
					captionText = img.getAttribute('title') || '';
				}

				// Option 3: Check for data-caption attribute
				if (!captionText && img.getAttribute('data-caption')) {
					captionText = img.getAttribute('data-caption') || '';
					// Properly unescape HTML entities that were escaped during serialization
					captionText = unescapeHtmlAttribute(captionText);
				}
			}

			/**
			 * Lift image node if parent isn't the root-element
			 */
			if (parentNode !== el) {
				const isValidPath = validateImageNodeParent(parentNode);
				if (!isValidPath) {
					liftImageNode(parentNode, img);
				}
			}

			/**
			 * Replace image with media node
			 */
			const mediaSingle = document.createElement('div');
			mediaSingle.setAttribute('data-node-type', 'mediaSingle');

			// parses media resizing attributes and adds them to the mediaSingle node
			if (options.shouldParseImageResizingAttributes) {
				const dataLayout = img.getAttribute('data-layout');
				const dataWidth = img.getAttribute('data-width');
				const dataWidthType = img.getAttribute('data-width-type');

				if (dataLayout && dataLayout !== 'null' && dataLayout !== 'undefined') {
					mediaSingle.setAttribute('data-layout', dataLayout);
				}

				if (dataWidth && dataWidth !== 'null' && dataWidth !== 'undefined') {
					mediaSingle.setAttribute('data-width', dataWidth);
				}

				if (dataWidthType && dataWidthType !== 'null' && dataWidthType !== 'undefined') {
					mediaSingle.setAttribute('data-width-type', dataWidthType);
				}
			}

			const media = document.createElement('div');
			media.setAttribute('data-node-type', 'media');
			media.setAttribute('data-type', 'external');
			media.setAttribute('data-alt', img.getAttribute('alt') || '');
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			media.setAttribute('data-url', img.getAttribute('src')!);

			mediaSingle.appendChild(media);

			// Create caption node if we have caption text (parsed earlier)
			if (options.shouldParseCaptions && captionText.trim()) {
				const caption = document.createElement('div');
				caption.setAttribute('data-node-type', 'caption');

				// Parse markdown formatting into HTML elements
				// This converts common markdown patterns to their HTML equivalents
				// which ProseMirror can then parse into the correct ADF nodes
				let parsedContent = captionText;

				// Escape HTML entities first to prevent XSS
				parsedContent = parsedContent
					.replace(/&/g, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')
					.replace(/"/g, '&quot;')
					.replace(/'/g, '&#39;');

				// Parse different marks that may exist in markdown using pre-compiled patterns
				parsedContent = parseMarkdownFormatting(parsedContent);

				caption.innerHTML = parsedContent;

				mediaSingle.appendChild(caption);
			}

			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			img.parentNode!.insertBefore(mediaSingle, img);
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			img.parentNode!.removeChild(img);
		});

	function validateImageNodeParent(node: Node): boolean {
		const ALLOWED_PARENTS = ['LI', 'UL', 'OL', 'TD', 'TH', 'TR', 'TBODY', 'THEAD', 'TABLE'];

		if (node === el) {
			return true;
		}

		if (ALLOWED_PARENTS.indexOf(node.nodeName) === -1) {
			return false;
		}

		if (!node.parentNode) {
			return false;
		}

		return validateImageNodeParent(node.parentNode);
	}

	function liftImageNode(node: Node, img: HTMLImageElement) {
		let foundParent = false;
		let parent = node;
		while (!foundParent) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			foundParent = validateImageNodeParent(parent.parentNode!);
			if (!foundParent) {
				// Ignored via go/ees005
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				parent = parent.parentNode!;
			}
		}

		const cloned = parent.cloneNode();
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const target = parent !== el ? parent.parentNode! : el;

		while (img.nextSibling) {
			cloned.appendChild(img.nextSibling);
		}

		if (node !== parent) {
			while (node.nextSibling) {
				cloned.appendChild(node.nextSibling);
			}
		}

		if (parent.nextSibling) {
			target.insertBefore(cloned, parent.nextSibling);
			target.insertBefore(img, cloned);
		} else {
			target.appendChild(img);
			target.appendChild(cloned);
		}

		/**
		 * If the splitting operation results in
		 * the old parent being empty, remove it
		 */
		if (node.childNodes.length === 0) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			node.parentNode!.removeChild(node);
		}

		/**
		 * Remove cloned element if it's empty.
		 */
		if (cloned.childNodes.length === 0) {
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			cloned.parentNode!.removeChild(cloned);
		}
	}

	// Remove any remaining figcaption elements to prevent them from being parsed as paragraphs
	// This handles cases where figcaptions exist but weren't processed by the image logic above
	Array.from(el.querySelectorAll('figcaption')).forEach((figcaption: HTMLElement) => {
		figcaption.remove();
	});

	return el;
}
