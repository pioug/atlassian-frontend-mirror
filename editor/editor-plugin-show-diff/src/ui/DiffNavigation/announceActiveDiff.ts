import type { IntlShape } from 'react-intl';

import type { Decoration } from '@atlaskit/editor-prosemirror/view';

import { isDiffDecoration } from '../../pm-plugins/decorations/decorationKeys';
import type { ContributorTagModel } from '../../showDiffPluginType';
import { formatContributorLabel } from '../ContributorTag/contributorLabel';

import { diffNavigationMessages } from './messages';

/**
 * The tag that captions the given decoration, if any. `linkedDiffIds` is checked as well as
 * `diffId`, because a replacement's two decorations share one tag and navigation can land on either.
 */
const findTagFor = (
	decoration: Decoration,
	contributorTags: ContributorTagModel[] | undefined,
): ContributorTagModel | undefined => {
	if (!contributorTags?.length || !isDiffDecoration(decoration)) {
		return undefined;
	}

	const { diffId } = decoration.spec;

	return contributorTags.find(
		(tag) => tag.diffId === diffId || tag.linkedDiffIds?.includes(diffId),
	);
};

/**
 * What a screen reader should say once the reader has stepped onto a change: where they are in the
 * diff, and — when the plugin can credit the change — who made it. Stepping otherwise only scrolls,
 * which is silent.
 *
 * Returns `undefined` for an index that resolves no change, so the caller says nothing at all
 * rather than "Change 4 of 3".
 */
export const getActiveDiffAnnouncement = ({
	activeIndex,
	contributorTags,
	decorations,
	intl,
}: {
	activeIndex: number;
	contributorTags: ContributorTagModel[] | undefined;
	/** The navigable changes, in document order — `getScrollableDecorations`'s result. */
	decorations: Decoration[];
	intl: IntlShape;
}): string | undefined => {
	const activeDecoration = decorations[activeIndex];
	if (!activeDecoration) {
		return undefined;
	}

	const position = { index: activeIndex + 1, total: decorations.length };
	const tag = findTagFor(activeDecoration, contributorTags);

	return tag
		? intl.formatMessage(diffNavigationMessages.activeChangeWithContributor, {
				...position,
				contributor: formatContributorLabel(tag, intl.formatMessage).fullLabel,
			})
		: intl.formatMessage(diffNavigationMessages.activeChange, position);
};
