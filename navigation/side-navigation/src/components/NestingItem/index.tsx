/** @jsx jsx */
import React, { Fragment, useCallback, useMemo, useState } from 'react';

import { jsx } from '@emotion/core';

import RightArrow from '@atlaskit/icon/glyph/arrow-right-circle';
import {
  ButtonItemProps,
  CSSFn,
  CustomItemComponentProps,
  Overrides,
} from '@atlaskit/menu';
import { N10 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import { overrideStyleFunction } from '../../common/styles';
import { ButtonItem, CustomItem, NavigationContent } from '../index';
import { ROOT_ID } from '../NestableNavigationContent';
import {
  NestedContext,
  useNestedContext,
} from '../NestableNavigationContent/context';

import { nestingItemStyle } from './styles';

interface NestingItemOverrides extends Overrides {
  /**
   * Use this to override the back button displayed when navigation is nested.
   * You'll want to import the [go back item](/packages/navigation/side-navigation/docs/go-back-item) component and use it here.
   * This will be displayed for all children nesting item components unless they define their own.
   */
  GoBackItem?: {
    render?: (props: {
      onClick: () => void;
      testId?: string;
    }) => React.ReactNode;
  };
}

// Doesn't extend from ButtonItemProps because it blows ERT up.
export interface NestingItemProps<
  TCustomComponentProps = CustomItemComponentProps
> {
  /**
   * A **unique identifier** for the nesting item.
   * Every nesting item component needs a unique id else undefined behavior will occur.
   */
  id: string;

  /**
   * Text to display when the nesting item is rendered as a interactable element.
   */
  title: React.ReactNode;

  /**
   * The view that should be shown when this nesting item is visible.
   */
  children: React.ReactNode;

  /**
   * Used to customize the rendered component when shown as an item.
   * You can use this for example to change it to a SPA link.
   */
  component?: React.ComponentType<TCustomComponentProps>;

  /**
   * A `testId` prop is provided for specified elements,
   * which is a unique string that appears as a data attribute `data-testid` in the rendered code,
   * serving as a hook for automated tests.

   * Will set these elements when defined:
   * - The container - `{testId}--container`
   * - The nesting item - `{testId}--item`
   * - The go back item - `{testId}--go-back-item` (only used if you pass in a override).
   * - The nesting item default right arrow icon - `{testId}--item--right-arrow`
   */
  testId?: string;

  /**
   * A function that can be used to override the styles of the component.
   * It receives the current styles and state and expects a styles object.
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
   * Custom overrides for the composed components.
   */
  overrides?: NestingItemOverrides;
}

/**
 * NestingItem will render itself differently depending in what context it is rendered in.
 * When not open - it will render itself as an item.
 * When open - it will render its children.
 */
const NestingItem = <TCustomComponentProps extends CustomItemComponentProps>(
  props: NestingItemProps<TCustomComponentProps> &
    Omit<TCustomComponentProps, keyof CustomItemComponentProps>,
) => {
  const {
    children,
    iconAfter,
    title,
    onClick,
    cssFn,
    isSelected,
    id,
    component,
    testId,
    ...rest
  } = props;
  const {
    currentStackId,
    onNest,
    onUnNest,
    backButton: contextualBackButton,
    stack,
  } = useNestedContext();

  const mergedStyles = overrideStyleFunction(nestingItemStyle, cssFn);

  const [isInteracted, setIsInteracted] = useState(false);

  const backButton =
    (props.overrides &&
      props.overrides.GoBackItem &&
      props.overrides.GoBackItem.render &&
      props.overrides.GoBackItem.render({
        onClick: onUnNest,
        testId: testId && `${testId}--go-back-item`,
      })) ||
    contextualBackButton;

  const context = useMemo(
    () => ({
      stack,
      currentStackId,
      onNest,
      onUnNest,
      backButton,
      parentId: id,
    }),
    [onNest, onUnNest, backButton, stack, id, currentStackId],
  );

  const isNormalClick = (e: MouseEvent) =>
    !(e.button || e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);

  /**
   * We want both the on nest handler and the onclick handler to be called.
   * We create a wrapper function to call both.
   */
  const onClickHandler: ButtonItemProps['onClick'] = useCallback(
    (e) => {
      if (isInteracted) {
        // We return early if this has been interacted with because its assumed
        // this will be already exiting - so we don't want to double up the click.
        return;
      }

      // Avoid a nesting transition if a modifier key is detected during click.
      if (isNormalClick(e)) {
        setIsInteracted(true);
        onNest(id);
      }

      onClick && onClick(e);
    },
    [isInteracted, onClick, onNest, id],
  );

  if (currentStackId === id) {
    return (
      <NestedContext.Provider value={context}>
        {stack.length >= 1 && (
          <div
            css={{
              marginLeft: gridSize(),
              marginRight: gridSize(),
              // This padding bottom needs to match the section margin inside @atlaskit/menu.
              paddingTop: gridSize() * 0.75,
              paddingBottom: gridSize() * 0.75,
            }}
          >
            {backButton}
          </div>
        )}
        <NavigationContent
          testId={testId}
          showTopScrollIndicator={stack.length >= 1}
        >
          {children}
        </NavigationContent>
      </NestedContext.Provider>
    );
  }

  if ([ROOT_ID, ...stack].includes(id)) {
    return children as JSX.Element;
  }

  const componentProps = {
    iconAfter: (
      <Fragment>
        {iconAfter ? <span data-custom-icon>{iconAfter}</span> : null}
        <span data-right-arrow>
          <RightArrow
            testId={testId && `${testId}--item--right-arrow`}
            secondaryColor={token('color.background.default', N10)}
            label=""
          />
        </span>
      </Fragment>
    ),
    onClick: onClickHandler,
    isSelected: isSelected || isInteracted,
    testId: testId && `${testId}--item`,
    ...rest,
    children: title,
    cssFn: mergedStyles,
  };

  if (component) {
    return (
      <CustomItem<CustomItemComponentProps>
        {...componentProps}
        //@ts-expect-error TODO Fix legit TypeScript 3.9.6 improved inference error
        component={component}
      />
    );
  }

  return <ButtonItem {...componentProps} />;
};

export default NestingItem;
