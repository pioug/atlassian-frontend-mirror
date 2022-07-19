## API Report File for "@atlaskit/menu"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts
/// <reference types="react" />

import { ComponentType } from 'react';
import { CSSObject } from '@emotion/core';
import { ForwardRefExoticComponent } from 'react';
import { MemoExoticComponent } from 'react';
import { ReactNode } from 'react';
import { Ref } from 'react';
import { RefAttributes } from 'react';

export declare interface BaseItemProps {
  /**
     A function that overrides the styles of the component.
     It receives the current styles and state and expects a styles object.

     @deprecated This API is deprecated and will be removed in a future release. See DSP-2676 for more information.
     */
  cssFn?: CSSFn;
  /**
   * Element to render before the item text.
   * Generally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
   */
  iconBefore?: React.ReactNode;
  /**
   * Element to render after the item text.
   * Generally should be an [icon](https://atlaskit.atlassian.com/packages/design-system/icon) component.
   */
  iconAfter?: React.ReactNode;
  /**
   * Event that is triggered when the element is clicked.
   */
  onClick?: (event: React.MouseEvent | React.KeyboardEvent) => void;
  /**
   * Event that is triggered when the element has been pressed.
   */
  onMouseDown?: React.MouseEventHandler;
  /**
   * Description of the item.
   * This will render smaller text below the primary text of the item as well as slightly increasing the height of the item.
   */
  description?: string | JSX.Element;
  /**
   * Makes the element appear disabled as well as removing interactivity.
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
     Custom overrides for the composed components.

     @deprecated This API is deprecated and will be removed in a future release. See DSP-2676 for more information.
     */
  overrides?: Overrides;
  /**
   * When `true` the title of the item will wrap multiple lines if it's long enough.
   */
  shouldTitleWrap?: boolean;
  /**
   * When `true` the description of the item will wrap multiple lines if it's long enough.
   */
  shouldDescriptionWrap?: boolean;
}

/**
 * __Button item__
 *
 * A button item is used to populate a menu with items that are buttons.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/button-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
export declare const ButtonItem: MemoExoticComponent<ForwardRefExoticComponent<
  ButtonItemProps & RefAttributes<HTMLElement>
>>;

export declare interface ButtonItemProps extends BaseItemProps {
  /**
   * Unique identifier for the element.
   */
  id?: string;
  /**
   * Used to override the accessibility role for the element.
   */
  role?: string;
}

/**
 A function that overrides the styles of
 menu components. It receives the current state
 and should return a CSSObject.

 @see @atlaskit/menu/docs/85-overriding-item-styles
 @deprecated This type is deprecated and will be removed in a future release. See DSP-2676 for more information.
 */
export declare interface CSSFn<
  TState = ItemState extends void ? void : ItemState
> {
  (currentState: TState): CSSObject | CSSObject[];
}

/**
 * __Custom item__
 *
 * A custom item is used to populate a menu with items that can be any element.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/custom-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
export declare const CustomItem: CustomItemTypeGenericHackProps;

export declare interface CustomItemComponentProps {
  /**
   * The children of the item.
   */
  children: React.ReactNode;
  /**
   * Class to apply to the root container of the custom component,
   * ensure this has been applied so the consistent item styling is applied.
   */
  className: string;
  /**
   * Test id that is passed through to the custom component.
   */
  'data-testid'?: string;
  /**
   * Event handler that is passed through to the custom component.
   */
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * Event handler that is passed through to the custom component.
   */
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void;
  /**
   * Event handler that is passed through to the custom component.
   * Used to disable the element from being draggable.
   */
  onDragStart?: (event: React.DragEvent) => void;
  /**
   * Turns off the element being draggable.
   */
  draggable: boolean;
  /**
   * React ref for the raw DOM element,
   * make sure to place this on the outer most DOM element.
   */
  ref?: Ref<any>;
  /**
   * Makes the element appear disabled as well as removing interactivity.
   */
  tabIndex?: number;
  /**
   * Disabled attribute.
   */
  disabled?: boolean;
}

export declare interface CustomItemProps<
  TCustomComponentProps = CustomItemComponentProps
> extends BaseItemProps {
  /**
     Custom component to render as an item. This can be both a functional component or a class component.

     __Will return `null` if no component is defined.__

     Props passed to `CustomItem` will be passed down to this component. If the props for `component` have TypeScript types,
     CustomItem will extend them, providing type safety for your custom item.

     e.g. `<CustomItem to="/link" component={RouterLink} />`

     __NOTE:__ Make sure the reference for this component does not change between renders else undefined behavior may happen.
     */
  component?: React.ComponentType<TCustomComponentProps>;
}

declare interface CustomItemTypeGenericHackProps {
  <TComponentProps>(
    props: CustomItemProps<TComponentProps> & {
      ref?: any;
    } & Omit<TComponentProps, keyof CustomItemComponentProps>,
  ): JSX.Element | null;
}

export declare type Dimension = string | number;

/**
 * __Heading item__
 *
 * A heading item is used to describe sibling menu items.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
export declare const HeadingItem: MemoExoticComponent<({
  children,
  testId,
  id,
  cssFn,
  ...rest
}: HeadingItemProps) => JSX.Element>;

export declare interface HeadingItemProps {
  /**
     A function that overrides the styles.
     It receives the current styles and returns a customized styles object.

     @deprecated This API is deprecated and will be removed in a future release. See DSP-2676 for more information.
     */
  cssFn?: StatelessCSSFn;
  /**
   * The text of the heading.
   */
  children: React.ReactNode;
  /**
   * A unique identifier that can be referenced in the `labelledby` prop of a
   * section to allow screen readers to announce the name of groups.
   */
  id?: string;
  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.
   */
  testId?: string;
}

export declare type ItemState = {
  isSelected: boolean;
  isDisabled: boolean;
};

/**
 * __Link item__
 *
 * A link item is used to populate a menu with items that are links.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/link-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
export declare const LinkItem: MemoExoticComponent<ForwardRefExoticComponent<
  LinkItemProps & RefAttributes<HTMLElement>
>>;

export declare interface LinkItemProps extends BaseItemProps {
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
   * Used to override the accessibility role for the element.
   */
  role?: string;
}

/**
 * __Menu group__
 *
 * A menu group includes all the actions or items in a menu.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/menu-group)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
export declare const MenuGroup: ({
  maxWidth,
  minWidth,
  minHeight,
  maxHeight,
  testId,
  role,
  ...rest
}: MenuGroupProps) => JSX.Element;

export declare interface MenuGroupProps extends MenuGroupSizing {
  /**
   * Children of the menu group,
   * should generally be `Section` components.
   */
  children: React.ReactNode;
  /**
   * Used to override the accessibility role for the element.
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

export declare interface MenuGroupSizing {
  /**
   * Useful to constrain the menu group minimum height to a specific value.
   */
  minHeight?: Dimension;
  /**
   * Useful to constrain the menu groups height to a specific value.
   * Needs to be set when wanting to have scrollable sections.
   */
  maxHeight?: Dimension;
  /**
   * Useful to constrain the menu group minimum width to a specific value.
   */
  minWidth?: Dimension;
  /**
   * Useful to constrain the menu group width to a specific value.
   */
  maxWidth?: Dimension;
}

/**
 * @deprecated This type is deprecated and will be removed in a future release. See DSP-2676 for more information.
 */
export declare interface Overrides {
  Title?: TitleOverrides;
}

/**
 * @deprecated
 */
export declare const PopupMenuGroup: ({
  maxWidth,
  minWidth,
  ...rest
}: MenuGroupProps) => JSX.Element;

export declare interface RenderFunction<TProps = {}> {
  (Component: ComponentType | string, props: TProps): React.ReactNode;
}

/**
 * __Section__
 *
 * A section includes related actions or items in a menu.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/section)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
export declare const Section: ForwardRefExoticComponent<
  SectionProps & RefAttributes<HTMLElement>
>;

declare interface SectionProps {
  /**
   * Unique identifier for the element.
   */
  id?: string;
  /**
   * Enables scrolling within the section.
   * Make sure to set `maxHeight` on the parent `MenuGroup` component else it will not work.
   */
  isScrollable?: boolean;
  /**
   * Will render a border at the top of the section.
   */
  hasSeparator?: boolean;
  /**
   * Children of the section,
   * should generally be `Item` or `Heading` components,
   * but can also be [`EmptyState`](https://atlaskit.atlassian.com/packages/design-system/empty-state)s when wanting to render errors.
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
  overrides?: {
    HeadingItem?: {
      /**
       * A function that overrides the styles of the component.
       * It receives the current styles and state and expects a styles object.
       */
      cssFn?: StatelessCSSFn;
    };
  };
  /**
   * The text passed into the internal HeadingItem. If a title is not provided,
   * the HeadingItem will not be rendered, and this component acts as a regular Section
   */
  title?: string;
}
export { SectionProps as SectionBaseProps };
export { SectionProps };

/**
 * __Skeleton heading item__
 *
 * A skeleton heading item is used in place of a heading item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-heading-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
export declare const SkeletonHeadingItem: ({
  isShimmering,
  testId,
  width,
  cssFn,
}: SkeletonHeadingItemProps) => JSX.Element;

export declare interface SkeletonHeadingItemProps {
  /**
   *
   * Width of the skeleton heading item.
   * Generally you don't need to specify this as it has a staggered width based on `:nth-child` by default.
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
     A function that overrides the styles of this component.
     It receives the current styles and returns a customized styles object.

     @deprecated This API is deprecated and will be removed in a future release. See DSP-2676 for more information.
     */
  cssFn?: StatelessCSSFn;
}

/**
 * __Skeleton item__
 *
 * A skeleton item is used in place of an item when its contents it not ready.
 *
 * - [Examples](https://atlaskit.atlassian.com/packages/design-system/menu/docs/skeleton-item)
 * - [Code](https://atlaskit.atlassian.com/packages/design-system/menu)
 */
export declare const SkeletonItem: ({
  hasAvatar,
  hasIcon,
  isShimmering,
  testId,
  width,
  cssFn,
}: SkeletonItemProps) => JSX.Element;

export declare interface SkeletonItemProps {
  /**
   * Renders a skeleton circle in the `iconBefore` location.
   * Takes priority over `hasIcon.
   */
  hasAvatar?: boolean;
  /**
   * Renders a skeleton square in the `iconBefore` location.
   */
  hasIcon?: boolean;
  /**
   *
   * Width of the skeleton item.
   * Generally you don't need to specify this as it has a staggered width based on `:nth-child` by default.
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
  cssFn?: StatelessCSSFn;
}

/**
 * @deprecated This type is deprecated and will be removed in a future release. See DSP-2676 for more information.
 */
export declare type StatelessCSSFn = CSSFn<void>;

/**
 * @deprecated This type is deprecated and will be removed in a future release. See DSP-2676 for more information.
 */
export declare interface TitleOverrides {
  render?: RenderFunction<{
    className?: string;
    children: ReactNode;
    'data-item-title': boolean;
  }>;
}

export {};
```