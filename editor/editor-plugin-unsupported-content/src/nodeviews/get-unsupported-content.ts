import type { IntlShape } from 'react-intl';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';

/**
 * Resolves the label shown on an unsupported content node.
 *
 * Duplicated from `@atlaskit/editor-common` (`src/ui/unsupported-content-helper.ts`) to avoid a
 * dependency issue. A separate PR will remove the duplication.
 *
 * @see https://hello.jira.atlassian.cloud/jira/browse/EDITOR-8637
 */
export function getUnsupportedContent(
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	message: any,
	prefix: string,
	node?: PMNode,
	intl?: IntlShape,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
	const defaultLocale = 'en';
	let canTranslateToLocale = true;
	const locale = intl ? intl.locale : defaultLocale;
	let finalMessage = message.defaultMessage;

	if (node && locale.startsWith(defaultLocale)) {
		// `confluenceUnsupportedBlock` and `confluenceUnsupportedInline` are declared with a
		// `cxhtml` attribute and no `originalValue`, so this must not assume it exists.
		//
		// NOTE: intentional deviation from the `@atlaskit/editor-common` original, which throws a
		// TypeError for those node types. In the React node views that throw is swallowed by
		// `ReactNodeView`'s ErrorBoundary; a vanilla node view has no such boundary, so it would
		// propagate out of the ProseMirror node view constructor. Keep this guard when the
		// duplication is resolved.
		//
		// @see https://hello.jira.atlassian.cloud/jira/browse/EDITOR-8637
		const { originalValue } = node.attrs;
		if (originalValue) {
			if (originalValue.text || (originalValue.attrs && originalValue.attrs.text)) {
				finalMessage = originalValue.text ? originalValue.text : originalValue.attrs.text;
				canTranslateToLocale = false;
			} else if (originalValue.type) {
				finalMessage = `${prefix} ${originalValue.type}`;
				canTranslateToLocale = false;
			}
		}
	}

	if (intl && canTranslateToLocale) {
		return intl.formatMessage(message);
	}

	return finalMessage;
}
