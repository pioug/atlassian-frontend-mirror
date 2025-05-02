import { type ComponentType, type PropsWithChildren, type ReactNode, type Ref } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { type CSSObject } from '@emotion/react';

import type { SpacingMode } from './internal/components/menu-context';

export interface RenderFunction<TProps = {}> {
	(Component: ComponentType | string, props: TProps): React.ReactNode;
}

/**
 * @deprecated This type is deprecated and will be removed in a future release. See DSP-2676 for more information.
 */
export interface TitleOverrides {
	render?: RenderFunction<{
		className?: string;
		children: ReactNode;
		'data-item-title': boolean;
	}>;
}

/**
 * @deprecated This type is deprecated and will be removed in a future release. See DSP-2676 for more information.
 */
export interface Overrides {
	Title?: TitleOverrides;
}

export type Dimension = string | number;

export interface MenuGroupSizing {
	/**
	 * Use this to constrain the menu group's minimum height to a specific value.
	 */
	minHeight?: Dimension;

	/**
	 * Use this to constrain the menu group's height to a specific value.
	 * This must be set if you want to have scrollable sections.
	 */
	maxHeight?: Dimension;

	/**
	 * Use this to constrain the menu group's minimum width to a specific value.
	 */
	minWidth?: Dimension;

	/**
	 * Use this to constrain the menu group's maximum width to a specific value.
	 */
	maxWidth?: Dimension;
}

export interface MenuGroupProps extends MenuGroupSizing {
	/**
	 * Children of the menu group.
	 * This should generally be `Section` components.
	 */
	children: React.ReactNode;

	/**
	 * Used this to tell assistive technologies that the menu group is loading.
	 */
	isLoading?: boolean;

	/**
	 * Configure the density of the menu group content.
	 */
	spacing?: SpacingMode;

	/**
	 * Use this to override the accessibility role for the element.
	 */
	role?: string;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Handler called when clicking on this element,
	 * or any children elements.
	 * Useful when needing to stop propagation of child events.
	 */
	onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
}

export interface SectionProps {
	/**
	 * Unique identifier for the element.
	 */
	id?: string;

	/**
	 * Enables scrolling within the section.
	 * This won't work unless `maxHeight` is set on the parent `MenuGroup` component.
	 */
	isScrollable?: boolean;

	/**
	 * Use this to render a border at the top of the section.
	 */
	hasSeparator?: boolean;

	/**
	 * Children of the section.
	 * This should generally be `Item` or `Heading` components,
	 * but can also be [`EmptyState`](https://atlaskit.atlassian.com/packages/design-system/empty-state)s if you want to render errors.
	 */
	children: React.ReactNode;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * @deprecated This API is deprecated and will be removed in a future release. See DSP-2676 for more information.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	overrides?: {
		HeadingItem?: {
			/**
			 * A function that overrides the styles of the component.
			 * It receives the current styles and state and expects a styles object.
			 */
			// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
			cssFn?: StatelessCSSFn;
		};
	};

	/**
	 * The text passed into the internal `HeadingItem`. If a title isn't provided,
	 * the `HeadingItem` won't be rendered, and this component will act as a regular `Section`.
	 */
	title?: string;

	/**
	 * ID referenced by the menu group wrapper's `aria-labelledby` attribute. This ID should be assigned to the group title element.
	 * Usage of either this, or the `label` attribute is strongly recommended.
	 */
	titleId?: string;

	/**
	 * If your menu contains a list, use this to add `<ul>` and `<li>` tags around the items. This is essential for offering better, accessible semantic markup in a list of items.
	 */
	isList?: boolean;
}

export interface MenuItemPrimitiveProps {
	children: (props: { className?: string; children: React.ReactNode }) => JSX.Element;
	title: React.ReactNode | undefined;
	description: React.ReactNode | undefined;
	iconAfter: React.ReactNode | undefined;
	iconBefore: React.ReactNode | undefined;
	shouldTitleWrap: boolean | undefined;
	shouldDescriptionWrap: boolean | undefined;
	isDisabled: boolean | undefined;
	isSelected: boolean | undefined;
	/**
	 * @deprecated This API exists to support functionality in `@atlaskit/side-navigation` and should not be used. Once the new navigation is fully rolled out, this prop will be removed.
	 */
	isTitleHeading: boolean | undefined;
	className?: string;
	testId?: string;
}

export interface MenuItemProps {
	/**
	 * Not recommended for general use as it enables unsafe style overrides.
	 */
	className?: string;

	/**
	 * Element to render before the item text.
	 * Usually this is an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
	 */
	iconBefore?: React.ReactNode;

	/**
	 * Element to render after the item text.
	 * Usually this is an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
	 */
	iconAfter?: React.ReactNode;

	/**
	 * Event that's triggered when the element is clicked.
	 */
	onClick?: (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => void;

	/**
	 * Event that's triggered when the element has been pressed.
	 */
	onMouseDown?: React.MouseEventHandler;

	/**
	 * Description of the item.
	 * This will render smaller text below the primary text of the item, and slightly increase the height of the item.
	 */
	description?: string | JSX.Element;

	/**
	 * Makes the element appear disabled as well as removing interactivity. Avoid disabling menu items wherever possible as this isn’t accessible or usable.
	 */
	isDisabled?: boolean;

	/**
	 * Makes the element appear selected.
	 */
	isSelected?: boolean;

	/**
	 * Primary content for the item.
	 */
	children?: React.ReactNode;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * When `true`, the title of the item will wrap multiple lines if it's long enough.
	 */
	shouldTitleWrap?: boolean;

	/**
	 * When `true`, the description of the item will wrap multiple lines if it's long enough.
	 */
	shouldDescriptionWrap?: boolean;

	/**
	 * When `true`, the title of the item will render as a `h2` rather than a `span`
	 * @deprecated This API exists to support functionality in `@atlaskit/side-navigation` and should not be used. Once the new navigation is fully rolled out, this prop will be removed.
	 */
	isTitleHeading?: boolean;

	/**
	 * An optional name used to identify events for [React UFO (Unified Frontend Observability) press interactions](https://developer.atlassian.com/platform/ufo/react-ufo/react-ufo/getting-started/#quick-start--press-interactions). For more information, see [React UFO integration into Design System components](https://go.atlassian.com/react-ufo-dst-integration).
	 */
	interactionName?: string;
}

export interface ButtonItemProps extends MenuItemProps {
	/**
	 * Unique identifier for the element.
	 */
	id?: string;

	/**
	 * Use this to override the accessibility role for the element.
	 */
	role?: string;
}

export interface LinkItemProps extends MenuItemProps {
	/**
	 * Link to another page.
	 */
	href?: string;

	/**
	 * Where to display the linked URL,
	 * see [anchor information](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a) on mdn for more information.
	 */
	target?: string;

	/**
	 * The relationship of the linked URL as space-separated link types.
	 * Generally you'll want to set this to "noopener noreferrer" when `target` is "_blank".
	 */
	rel?: string;

	/**
	 * Use this to override the accessibility role for the element.
	 */
	role?: string;

	/**
	 * Use this to opt out of using a router link and instead use a regular anchor element.
	 * Marked as "unsafe" because ideally, router links should be used for all internal links.
	 */
	UNSAFE_shouldDisableRouterLink?: boolean;

	/**
	 * Use this to prevent disable of drag functionality on the menu item.
	 * Marked as "unsafe" as this may break existing instances of drag handling.
	 */
	UNSAFE_isDraggable?: boolean;
}

export interface CustomItemComponentProps {
	/**
	 * The children of the item.
	 */
	children: React.ReactNode;

	/**
	 * Class to apply to the root container of the custom component.
	 * Ensure this has been applied so the item styling is consistent.
	 */
	className?: string;

	/**
	 * Test ID that's passed through to the custom component.
	 */
	'data-testid'?: string;

	/**
	 * Event handler that's passed through to the custom component.
	 */
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;

	/**
	 * Event handler that's passed through to the custom component.
	 */
	onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;

	/**
	 * Event handler that's passed through to the custom component.
	 * Use this to disable the element from being draggable.
	 */
	onDragStart?: (event: React.DragEvent) => void;

	/**
	 * Turns off the element being draggable.
	 */
	// This needs to be the raw DOM attribute so we can't name it isXyz.
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	draggable?: boolean;

	/**
	 * React ref for the raw DOM element,
	 * make sure to place this on the outermost DOM element.
	 */
	ref?: Ref<any>;

	/**
	 * If the tab is selected, the tab index is `0` and is focusable. Otherwise it is `-1` and is not focusable.
	 */
	tabIndex?: number;

	/**
	 * Makes the element appear disabled as well as removing interactivity. Avoid disabling menu items wherever possible as this isn’t accessible or usable.
	 */
	// This needs to be the raw DOM attribute so we can't name it isXyz.
	// eslint-disable-next-line @repo/internal/react/boolean-prop-naming-convention
	disabled?: boolean;
}

export interface CustomItemProps<TCustomComponentProps = CustomItemComponentProps>
	extends MenuItemProps {
	/**
	 * Custom component to render as an item. This can be both a functional component or a class component.
	 *
	 * Will return `null` if no component is defined.
	 *
	 * Props passed to `CustomItem` will be passed down to this component. If the props for `component` have TypeScript types,
	 * CustomItem will extend them, providing type safety for your custom item.
	 *
	 * E.g. `<CustomItem to="/link" component={RouterLink} />`.
	 *
	 * __NOTE:__ Make sure the reference for this component does not change between renders else undefined behavior may happen.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	component?: React.ComponentType<PropsWithChildren<TCustomComponentProps>>;

	/**
	 * Use this to prevent disable of drag functionality on the menu item.
	 * Marked as "unsafe" as this may break existing instances of drag handling.
	 */
	UNSAFE_isDraggable?: boolean;
}

export interface SkeletonItemProps {
	/**
	 * Renders a skeleton circle in the `iconBefore` location.
	 * Takes priority over `hasIcon`.
	 */
	hasAvatar?: boolean;

	/**
	 * Renders a skeleton square in the `iconBefore` location.
	 */
	hasIcon?: boolean;

	/**
	 *
	 * Width of the skeleton item.
	 * You usually don't need to specify this, as it has a staggered width based on `:nth-child` by default.
	 */
	width?: Dimension;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Causes to the skeleton to have a slight horizontal shimmer.
	 * Only use this when you want to bring more attention to the loading content.
	 */
	isShimmering?: boolean;

	/**
	 * A function that overrides the styles of this component.
	 * It receives the current styles and returns a customized styles object.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	cssFn?: StatelessCSSFn;
}

export interface HeadingItemProps {
	/**
	 * A function that overrides the styles.
	 * It receives the current styles and returns a customized styles object.
	 *
	 * @deprecated This API is deprecated and will be removed in a future release. See DSP-2676 for more information.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	cssFn?: StatelessCSSFn;

	/**
	 * The text of the heading.
	 */
	children: React.ReactNode;

	/**
	 * A unique identifier that can be referenced in the `labelledby` prop of a
	 * section to allow assistive technology to announce the name of groups.
	 */
	id?: string;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * Specifies the heading level in the document structure.
	 * If not specified, the default is `h2`.
	 */
	headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface SkeletonHeadingItemProps {
	/**
	 *
	 * Width of the skeleton heading item.
	 * You usually don't need to specify this, as it has a staggered width based on `:nth-child` by default.
	 */
	width?: Dimension;

	/**
	 * A `testId` prop is provided for specified elements,
	 * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
	 * serving as a hook for automated tests.
	 */
	testId?: string;

	/**
	 * Causes to the skeleton to have a slight horizontal shimmer.
	 * Only use this when you want to bring more attention to the loading content.
	 */
	isShimmering?: boolean;

	/**
	 * A function that overrides the styles of this component.
	 * It receives the current styles and returns a customized styles object.
	 *
	 * @deprecated This API is deprecated and will be removed in a future release. See DSP-2676 for more information.
	 */
	// eslint-disable-next-line @repo/internal/react/consistent-props-definitions
	cssFn?: StatelessCSSFn;
}

export type ItemState = { isSelected: boolean; isDisabled: boolean };

/**
 * A function that overrides the styles of
 * menu components. It receives the current state
 * and should return a CSSObject.
 *
 * @see @atlaskit/menu/docs/85-overriding-item-styles
 * @deprecated This type is deprecated and will be removed in a future release. See DSP-2676 for more information.
 */
export interface CSSFn<TState = ItemState extends void ? void : ItemState> {
	(currentState: TState): CSSObject | CSSObject[];
}

/**
 * @deprecated This type is deprecated and will be removed in a future release. See DSP-2676 for more information.
 */
export type StatelessCSSFn = CSSFn<void>;
