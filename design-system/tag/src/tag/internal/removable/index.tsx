/** @jsx jsx */
import { forwardRef, memo, useCallback, useMemo, useState } from 'react';

import { jsx } from '@emotion/core';

import {
  useCallbackWithAnalytics,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';
import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

// eslint-disable-next-line import/order
import { getThemeColors } from '../../../theme';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export interface RemovableTagProps
  extends SimpleTagProps,
    WithAnalyticsEventsProps {
  /** Text render as the aria-label for remove button. */
  removeButtonLabel?: string;
  /** Flag to indicate if a tag is removeable. */
  isRemovable?: boolean;
  /** Handler to be called before the tag is removed. If it does not return a
   truthy value, the tag will not be removed. */
  onBeforeRemoveAction?: () => boolean;
  /** Handler to be called after tag is removed. Called with the string 'Post
   Removal Hook'. */
  onAfterRemoveAction?: (text: string) => void;
}

import BaseTag from '../shared/base';
import Before from '../shared/before';
import Content from '../shared/content';
import {
  chromeLinkStyles,
  chromeStyles,
  roundedBorderStyles,
} from '../shared/styles';
import { SimpleTagProps } from '../shared/types';
import { mergeRefs } from '../shared/utils';

import { removeButtonStyles } from './styles';

interface ThemedRemovableTagProps extends RemovableTagProps {
  mode: ThemeModes;
}

const defaultBeforeRemoveAction = () => true;
const noop = () => {};

enum TagStatus {
  Showing = 'showing',
  Removing = 'removing',
  Removed = 'removed',
}

const InnerRemovableTag = forwardRef<any, ThemedRemovableTagProps>(
  (props, ref) => {
    const [status, setStatus] = useState<TagStatus>(TagStatus.Showing);
    const [isHoverCloseButton, setIsHoverCloseButton] = useState<boolean>(
      false,
    );

    const {
      appearance = 'default',
      elemBefore = null,
      isRemovable = true,
      text = '',
      color = 'standard',
      mode = 'light',
      href,
      removeButtonLabel,
      testId,
      onBeforeRemoveAction = defaultBeforeRemoveAction,
      onAfterRemoveAction = noop,
    } = props;

    const isRounded = appearance === 'rounded';
    const isLink = Boolean(href);

    const onAfterRemoveActionWithAnalytics = useCallbackWithAnalytics(
      onAfterRemoveAction,
      {
        action: 'removed',
        actionSubject: 'tag',
        attributes: {
          componentName: 'tag',
          packageName,
          packageVersion,
        },
      },
      'atlaskit',
    );

    const handleRemoveComplete = useCallback(() => {
      onAfterRemoveActionWithAnalytics(text);
      setStatus(TagStatus.Removed);
    }, [onAfterRemoveActionWithAnalytics, text]);

    const handleRemoveRequest = useCallback(() => {
      if (onBeforeRemoveAction && onBeforeRemoveAction()) {
        handleRemoveComplete();
      }
    }, [handleRemoveComplete, onBeforeRemoveAction]);

    const onKeyPress = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        const spacebarOrEnter = e.key === ' ' || e.key === 'Enter';

        if (spacebarOrEnter) {
          e.stopPropagation();
          handleRemoveRequest();
        }
      },
      [handleRemoveRequest],
    );

    const removingTag = useCallback(() => setStatus(TagStatus.Removing), []);

    const showingTag = useCallback(() => setStatus(TagStatus.Showing), []);

    const handleHoveringRemoveButton = useCallback(
      (isHover) => setIsHoverCloseButton(isHover),
      [],
    );

    const {
      chromeColors,
      chromeLinkColors,
      buttonColors,
      linkHoverColor,
    } = useMemo(() => getThemeColors(color, mode, true), [color, mode]);

    const chromeContainerForLinkStyles = [
      chromeLinkStyles(chromeLinkColors),
      isRounded ? roundedBorderStyles : undefined,
    ];

    const chromeContainerStyles = [
      chromeStyles({
        ...chromeColors,
      }),
      isRounded ? roundedBorderStyles : undefined,
    ];

    const removeButton = isRemovable ? (
      <button
        css={[
          removeButtonStyles({
            ...buttonColors,
          }),
          isRounded ? roundedBorderStyles : undefined,
        ]}
        tabIndex={0}
        aria-label={`${removeButtonLabel} ${text}`}
        onClick={handleRemoveRequest}
        onFocus={removingTag}
        onBlur={showingTag}
        onKeyPress={onKeyPress}
        onMouseOver={() => isLink && handleHoveringRemoveButton(true)}
        onMouseOut={() => isLink && handleHoveringRemoveButton(false)}
        type="button"
        data-testid={`close-button-${testId}`}
      >
        <EditorCloseIcon label="close tag" size="small" />
      </button>
    ) : undefined;

    const tagCss = [
      ...chromeContainerStyles,
      isLink ? chromeContainerForLinkStyles : undefined,
    ];

    const content = (
      <Content
        {...props}
        isRemovable={isRemovable}
        isLink={isLink}
        isRounded={isRounded}
        linkHoverColor={linkHoverColor}
      />
    );

    return (
      <ExitingPersistence>
        {!(status === TagStatus.Removed) && (
          <ShrinkOut>
            {(motion) => {
              return (
                <BaseTag
                  ref={mergeRefs(motion.ref, ref)}
                  testId={testId}
                  tagCss={tagCss}
                  data-removable
                  data-removing={status === TagStatus.Removing}
                  data-ishoverclosebutton={isHoverCloseButton}
                  before={
                    <Before
                      isRounded={isRounded}
                      elemBefore={elemBefore}
                      styles={chromeColors}
                    />
                  }
                  contentElement={content}
                  after={removeButton}
                />
              );
            }}
          </ShrinkOut>
        )}
      </ExitingPersistence>
    );
  },
);

const RemovableTag = memo(
  forwardRef<any, RemovableTagProps>((props, ref) => (
    <GlobalTheme.Consumer>
      {(tokens: GlobalThemeTokens) => (
        <InnerRemovableTag {...props} mode={tokens.mode} ref={ref} />
      )}
    </GlobalTheme.Consumer>
  )),
);

export default RemovableTag;
