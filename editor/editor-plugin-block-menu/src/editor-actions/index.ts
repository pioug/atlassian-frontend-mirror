import type { RegisterBlockMenuComponent } from '../blockMenuPluginType';

/**
 * Create a simple registry for block menu components.
 *
 * @returns A registry object with a `register` method and a `components` array.
 *
 * @example
 * ```ts
 * const registry = createBlockMenuRegistry();
 * registry.register(
 *   [{
 *     type: 'block-menu-section' as const,
 *     key: 'block-menu-section-format',
 *     rank: 100,
 *     component: ({ children }: { children: React.ReactNode }) => {
 *       return <ToolbarDropdownItemSection>{children}</ToolbarDropdownItemSection>;
 *     },
 *   },
 *   {
 *     type: 'block-menu-nested' as const,
 *     key: 'nested-menu',
 *     parent: {
 *       type: 'block-menu-section' as const,
 *       key: 'block-menu-section-format',
 *       rank: 100,
 *     },
 *     component: () => {
 *       return (
 *         <ToolbarNestedDropdownMenu>{...}</ToolbarNestedDropdownMenu>
 *       );
 *     },
 *   },
 *   {
 *     type: 'block-menu-item' as const,
 *     key: 'block-menu-item-create-jira',
 *     parent: {
 *       type: 'block-menu-section' as const,
 *       key: 'block-menu-section-format',
 *       rank: 200,
 *     },
 *     component: () => {
 *       return <ToolbarDropdownItem elemBefore={<JiraIcon label="" />}>Create Jira work item</ToolbarDropdownItem>;
 *     },
 *   },
 *   ]);
 * ```
 *
 */
export const createBlockMenuRegistry = () => {
	const components: RegisterBlockMenuComponent[] = [];

	const register = (blockMenuComponents: RegisterBlockMenuComponent[]) => {
		components.push(...blockMenuComponents);
	};

	return {
		register,
		components,
	};
};
