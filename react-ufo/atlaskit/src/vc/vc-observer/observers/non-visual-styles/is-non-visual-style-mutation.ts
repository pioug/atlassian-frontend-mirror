import { fg } from '@atlaskit/platform-feature-flags';

/**
 * Checks if a mutation record represents a non-visual style change
 * @param mutation - The mutation record to check
 * @returns boolean indicating if this is a non-visual style mutation
 *
 * A mutation is considered non-visual if:
 * - The target has data-	vc-nvs="true" attribute
 * - The changed attribute is either 'class' or 'style'
 */

export default function isNonVisualStyleMutation({
	target,
	attributeName,
}: {
	type: string;
	target?: Node | null;
	attributeName?: string | null;
}) {
	const isNonVisualStyleMutationEnabled = fg('platform_ufo_non_visual_style_mutation');

	if (!isNonVisualStyleMutationEnabled) {
		return false;
	}

	if (!(target instanceof Element)) {
		return false;
	}

	if (attributeName !== 'class' && attributeName !== 'style') {
		return false;
	}

	if (target.getAttribute('data-vc-nvs') !== 'true') {
		return false;
	}

	return true;
}
