import { type SelectOption } from '../../../common/modal/popup-select/types';
import { type AggJqlBuilderFieldNode } from '../types';
import { checkAndConvertToAbsoluteUrl } from './checkAndConvertToAbsoluteUrl';
import { getLozengeAppearance } from './getLozengeAppearance';

export function mapNodeToOption({
	displayName,
	jqlTerm,
	group,
	issueTypes,
	project,
	statusCategory,
	user,
	siteUrl,
}: AggJqlBuilderFieldNode & { siteUrl?: string }): SelectOption | null {
	try {
		const baseProps = {
			label: displayName,
			// this ensures that the returned value is not wrapped in single and double quotes
			// e.g. '"value"' -> 'value'
			value: decodeURIComponent(jqlTerm).replace(/^"|"$/g, ''),
		};

		if (user) {
			return {
				...baseProps,
				optionType: 'avatarLabel',
				avatar: user.picture,
				isSquare: false,
			};
		}

		if (group) {
			return {
				...baseProps,
				optionType: 'avatarLabel',
				isGroup: true,
			};
		}

		if (project) {
			return {
				...baseProps,
				optionType: 'iconLabel',
				icon: checkAndConvertToAbsoluteUrl(project.avatar?.small, siteUrl),
			};
		}

		if (issueTypes) {
			return {
				...baseProps,
				optionType: 'iconLabel',
				icon: checkAndConvertToAbsoluteUrl(issueTypes[0]?.avatar.small, siteUrl),
			};
		}

		if (statusCategory) {
			return {
				...baseProps,
				optionType: 'lozengeLabel',
				appearance: getLozengeAppearance(statusCategory.colorName),
			};
		}

		return null;
	} catch (error) {
		return null;
	}
}
