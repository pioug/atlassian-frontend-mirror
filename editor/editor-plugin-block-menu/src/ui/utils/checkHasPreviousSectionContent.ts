import {
	TRANSFORM_SUGGESTED_MENU_SECTION,
	TRANSFORM_CREATE_MENU_SECTION,
	TRANSFORM_STRUCTURE_MENU_SECTION,
} from '@atlaskit/editor-common/block-menu';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';

import type { BlockMenuPlugin } from '../../blockMenuPluginType';
import {
	buildChildrenMap,
	getChildrenMapKey,
	willComponentRender,
} from '../block-menu-renderer/utils';

/**
 * Checks if a section has any visible content (items that will render)
 */
const hasSectionContent = (
	sectionKey: string,
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): boolean => {
	const blockMenuComponents = api?.blockMenu?.actions.getBlockMenuComponents();
	if (!blockMenuComponents) {
		return false;
	}

	const childrenMap = buildChildrenMap(blockMenuComponents);
	const sectionMapKey = getChildrenMapKey(sectionKey, 'block-menu-section');
	const sectionChildren = childrenMap.get(sectionMapKey) || [];

	return sectionChildren.some((child) => willComponentRender(child, childrenMap));
};

/**
 * Checks if the Suggested section has any visible content
 */
export const hasSuggestedSectionContent = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): boolean => {
	return hasSectionContent(TRANSFORM_SUGGESTED_MENU_SECTION.key, api);
};

/**
 * Checks if the Create section has any visible content
 */
export const hasCreateSectionContent = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): boolean => {
	return hasSectionContent(TRANSFORM_CREATE_MENU_SECTION.key, api);
};

/**
 * Checks if the Structure section has any visible content
 */
export const hasStructureSectionContent = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): boolean => {
	return hasSectionContent(TRANSFORM_STRUCTURE_MENU_SECTION.key, api);
};

/**
 * Checks if there's any content before the Create section (i.e., Suggested section has content)
 */
export const hasContentBeforeCreate = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): boolean => {
	return hasSuggestedSectionContent(api);
};

/**
 * Checks if there's any content before the Structure section (i.e., Create or Suggested sections have content)
 */
export const hasContentBeforeStructure = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): boolean => {
	return hasCreateSectionContent(api) || hasSuggestedSectionContent(api);
};

/**
 * Checks if there's any content before the Headings section (i.e., Structure, Create, or Suggested sections have content)
 */
export const hasContentBeforeHeadings = (
	api: ExtractInjectionAPI<BlockMenuPlugin> | undefined,
): boolean => {
	return (
		hasStructureSectionContent(api) ||
		hasCreateSectionContent(api) ||
		hasSuggestedSectionContent(api)
	);
};
