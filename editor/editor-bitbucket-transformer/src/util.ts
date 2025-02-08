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
			// eslint-disable-next-line require-unicode-regexp
			.replace(/^(\d+)\./, '$1\\.');
	}
	if (insideTable) {
		// Ignored via go/ees005
		// eslint-disable-next-line require-unicode-regexp
		strToEscape = strToEscape.replace(/[|]/g, '\\$&');
	}
	return strToEscape;
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

/**
 * This function gets markup rendered by Bitbucket server and transforms it into markup that
 * can be consumed by Prosemirror HTML parser, conforming to our schema.
 */
export function transformHtml(
	html: string,
	options: { disableBitbucketLinkStripping?: boolean },
): HTMLElement {
	const el = document.createElement('div');
	el.innerHTML = html;

	// Remove zero-width-non-joiner
	Array.from(el.querySelectorAll('p')).forEach((p: HTMLParagraphElement) => {
		removeSpecialCharacters(p);
	});

	// convert suggestion code block to a suggestion div
	Array.from(el.querySelectorAll('div.language-suggestion')).forEach(function (div, index) {
		// convert to suggestion view mode extension
		const suggestionDiv = document.createElement('div');
		suggestionDiv.setAttribute('data-node-type', 'extension');
		suggestionDiv.setAttribute('data-extension-type', 'com.atlassian.bbc.code-suggestions');
		suggestionDiv.setAttribute('data-extension-key', 'codesuggestions:suggestion-node');
		suggestionDiv.setAttribute(
			'data-parameters',
			JSON.stringify({
				suggestionIndex: index,
				suggestionText: div.textContent || '',
			}),
		);
		if (div.parentNode) {
			div.parentNode.insertBefore(suggestionDiv, div);
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

			const media = document.createElement('div');
			media.setAttribute('data-node-type', 'media');
			media.setAttribute('data-type', 'external');
			media.setAttribute('data-alt', img.getAttribute('alt') || '');
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			media.setAttribute('data-url', img.getAttribute('src')!);

			mediaSingle.appendChild(media);

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

	return el;
}
