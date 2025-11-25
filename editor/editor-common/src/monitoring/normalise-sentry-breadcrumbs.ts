import type { Breadcrumb } from '@sentry/types';

export const SERIALIZABLE_ATTRIBUTES = ['data-test-id', 'data-testid'];
const WHITELISTED_ATTRIBNUTES = ['type', 'name', ...SERIALIZABLE_ATTRIBUTES];
const REG_MATCH_NOTALLOWED_ATTRIBUTES = new RegExp(
	`\\[(?!${WHITELISTED_ATTRIBNUTES.join('|')}).*?\\]`,
	'gmu',
);

// attributes may contain UGC that we need to strip out
// only allow type and name attributes
const sanitiseUiBreadcrumbMessage = (message: string): string =>
	message.replace(REG_MATCH_NOTALLOWED_ATTRIBUTES, '');
/**
 * Sanitizes messages within UI category breadcrumbs to ensure user-generated content is
 * appropriately cleaned before being logged by Sentry. This helps in maintaining
 * privacy and security by preventing sensitive data exposure.
 */
export const normaliseSentryBreadcrumbs = (breadcrumb: Breadcrumb) => {
	const { category } = breadcrumb || {};

	// allow "ui*"" category breadcrumbs, that include clicks and inputs on DOM elements
	// they may contain UGC that needs to be stripped out
	if (category?.startsWith('ui')) {
		// sentry can include the element attributes in the data
		// which may contain UGC that we need to strip out
		const sanitisedBreadCrumb = breadcrumb;
		const { message } = sanitisedBreadCrumb;
		if (message !== null && message !== undefined) {
			sanitisedBreadCrumb.message = sanitiseUiBreadcrumbMessage(message);
		}
		return breadcrumb;
	}
	return breadcrumb;
};
