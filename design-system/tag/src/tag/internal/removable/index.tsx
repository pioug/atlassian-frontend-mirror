/** @jsx jsx */
import { forwardRef, memo, useCallback, useState } from 'react';

import { css, jsx } from '@emotion/react';

import {
  useCallbackWithAnalytics,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import noop from '@atlaskit/ds-lib/noop';
import { ExitingPersistence, ShrinkOut } from '@atlaskit/motion';

import { cssVar } from '../../../constants';
import * as styles from '../../../styles';
import BaseTag from '../shared/base';
import Before from '../shared/before';
import Content from '../shared/content';
import { SimpleTagProps } from '../shared/types';

import RemoveButton from './remove-button';

export interface RemovableTagProps
  extends SimpleTagProps,
    WithAnalyticsEventsProps {
  /**
   * Text rendered as the aria-label for remove button.
   */
  removeButtonLabel?: string;
  /**
   * Flag to indicate if a tag is removable.
   */
  isRemovable?: boolean;
  /**
   * Handler to be called before the tag is removed. If it does not return a
   * truthy value, the tag will not be removed.
   */
  onBeforeRemoveAction?: () => boolean;
  /**
   * Handler to be called after tag is removed. Called with the string 'Post
   * Removal Hook'.
   */
  onAfterRemoveAction?: (text: string) => void;
}

enum TagStatus {
  Showing = 'showing',
  Removing = 'removing',
  Removed = 'removed',
}

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

const defaultBeforeRemoveAction = () => true;

/**
 * These hide the focus ring for the tag when its remove button is focused,
 * preventing a double focus ring.
 */
const removingStyles = css({
  '&:focus-within': {
    boxShadow: `0 0 0 2px transparent`,
    outline: 'none',
  },
});

const RemovableTag = forwardRef<any, RemovableTagProps>(
  (
    {
      appearance,
      elemBefore = null,
      isRemovable = true,
      text = '',
      color = 'standard',
      href,
      removeButtonLabel,
      testId,
      onBeforeRemoveAction = defaultBeforeRemoveAction,
      onAfterRemoveAction = noop,
      linkComponent,
    },
    ref,
  ) => {
    const [status, setStatus] = useState<TagStatus>(TagStatus.Showing);
    const [isHoverCloseButton, setIsHoverCloseButton] = useState(false);

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

    const handleMouseOver = useCallback(() => setIsHoverCloseButton(true), []);
    const handleMouseOut = useCallback(() => setIsHoverCloseButton(false), []);

    const removeButton = isRemovable ? (
      <RemoveButton
        aria-label={`${removeButtonLabel} ${text}`}
        onClick={handleRemoveRequest}
        onFocus={removingTag}
        onBlur={showingTag}
        onKeyPress={onKeyPress}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        testId={`close-button-${testId}`}
      />
    ) : undefined;

    const content = (
      <Content
        elemBefore={elemBefore}
        isRemovable={isRemovable}
        text={text}
        color={color}
        href={href}
        linkComponent={linkComponent}
      />
    );

    const hoverCloseButtonColors = {
      // Tag background color on hover
      [cssVar.color.background.hover]: styles.removalHoverBackgroundColors,
      // Tag background color on press
      [cssVar.color.background.active]: styles.removalActiveBackgroundColors,
      // The tag text on hover of remove button
      [cssVar.color.text.default]: styles.removalTextColors,
      // 'elemBefore' text on press of remove button
      [cssVar.color.text.active]: styles.removalTextColors,
      // The tag link text on hover of remove button
      [cssVar.color.text.link]: styles.removalTextColors,
    };

    return (
      <ExitingPersistence>
        {!(status === TagStatus.Removed) && (
          <ShrinkOut>
            {(motion) => {
              return (
                <BaseTag
                  ref={mergeRefs([motion.ref, ref])}
                  appearance={appearance}
                  color={color}
                  testId={testId}
                  css={[status === TagStatus.Removing && removingStyles]}
                  style={
                    isHoverCloseButton ? hoverCloseButtonColors : undefined
                  }
                  data-removable
                  data-removing={status === TagStatus.Removing}
                  data-ishoverclosebutton={isHoverCloseButton}
                  href={href}
                  before={<Before elemBefore={elemBefore} />}
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

export default memo(RemovableTag);
