/** @jsx jsx */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { css, jsx } from '@emotion/core';
import Loadable from 'react-loadable';

import { usePlatformLeafEventHandler } from '@atlaskit/analytics-next';
import Button from '@atlaskit/button/custom-theme-button';
import Field from '@atlaskit/form/Field';
import Form from '@atlaskit/form/Form';
import ConfirmIcon from '@atlaskit/icon/glyph/check';
import CancelIcon from '@atlaskit/icon/glyph/cross';
import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

import { InlineEditUncontrolledProps } from '../../types';
import {
  name as packageName,
  version as packageVersion,
} from '../../version.json';

import {
  buttonsContainerStyles,
  editButtonStyles,
  getButtonWrapperStyles,
  readViewContentWrapperStyles,
} from './styles';

const DRAG_THRESHOLD = 5;

const analyticsAttributes = {
  componentName: 'inlineEdit',
  packageName,
  packageVersion,
};

const InlineDialog = Loadable({
  loader: () =>
    import(
      /* webpackChunkName: "@atlaskit-internal_inline-edit-dialog" */ '@atlaskit/inline-dialog'
    ),
  loading: () => null,
});

function usePrevious(value: any) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

interface ExtendedInlineEditUncontrolledProps<FieldValue>
  extends InlineEditUncontrolledProps<FieldValue> {
  mode: ThemeModes;
}

const noop = () => {};

const InnerInlineEditUncontrolled = <FieldValue extends any>(
  props: ExtendedInlineEditUncontrolledProps<FieldValue>,
) => {
  const {
    keepEditViewOpenOnBlur = false,
    hideActionButtons = false,
    isRequired = false,
    readViewFitContainerWidth = false,
    editButtonLabel = 'Edit',
    confirmButtonLabel = 'Confirm',
    cancelButtonLabel = 'Cancel',
    defaultValue,
    isEditing,
    label,
    validate,
    readView,
    editView,
    onCancel = noop,
    analyticsContext,
    onConfirm: providedOnConfirm,
    onEditRequested,
    mode,
  } = props;

  const onConfirm = usePlatformLeafEventHandler({
    fn: providedOnConfirm,
    action: 'confirmed',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  const [
    wasFocusReceivedSinceLastBlur,
    setWasFocusReceivedSinceLastBlur,
  ] = useState(false);
  const [preventFocusOnEditButton, setPreventFocusOnEditButton] = useState(
    false,
  );

  const editButtonRef = useRef(null);

  let startX: number = 0;
  let startY: number = 0;

  let confirmationTimeoutId: number | undefined;

  const prevIsEditing = usePrevious(isEditing);
  useEffect(() => {
    /**
     * This logic puts the focus on the edit button after confirming using
     * the confirm button or using the keyboard to confirm, but not when
     * it is confirmed by wrapper blur
     */
    if (prevIsEditing && !isEditing) {
      if (preventFocusOnEditButton) {
        setPreventFocusOnEditButton(false);
      } else if (editButtonRef) {
        // @ts-ignore
        editButtonRef.current && editButtonRef.current.focus();
      }
    }
  }, [prevIsEditing, isEditing, preventFocusOnEditButton]);

  useEffect(() => {
    return () => {
      if (confirmationTimeoutId) {
        window.clearTimeout(confirmationTimeoutId);
      }
    };
  }, [confirmationTimeoutId]);

  const onCancelClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      onCancel();
    },
    [onCancel],
  );

  const mouseHasMoved = (event: { clientX: number; clientY: number }) => {
    return (
      Math.abs(startX - event.clientX) >= DRAG_THRESHOLD ||
      Math.abs(startY - event.clientY) >= DRAG_THRESHOLD
    );
  };

  const onReadViewClick = (
    event: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ) => {
    const element = event.target as HTMLElement;
    /** If a link is clicked in the read view, default action should be taken */
    if (element.tagName.toLowerCase() !== 'a' && !mouseHasMoved(event)) {
      event.preventDefault();
      onEditRequested();
      setPreventFocusOnEditButton(true);
    }
  };

  /** Unless keepEditViewOpenOnBlur prop is true, will call confirmIfUnfocused() which
   *  confirms the value, unless the focus is transferred to the buttons
   */
  const onWrapperBlur = (
    isInvalid: boolean,
    onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void,
    formRef: React.RefObject<HTMLFormElement>,
  ) => {
    if (!keepEditViewOpenOnBlur) {
      setWasFocusReceivedSinceLastBlur(false);
      /**
       * This ensures that clicking on one of the action buttons will call
       * onWrapperFocus before confirmIfUnfocused is called
       */
      confirmationTimeoutId = window.setTimeout(() =>
        confirmIfUnfocused(isInvalid, onSubmit, formRef),
      );
    }
  };

  /** Gets called when focus is transferred to the editView, or action buttons */
  const onWrapperFocus = () => {
    setWasFocusReceivedSinceLastBlur(true);
  };

  const confirmIfUnfocused = (
    isInvalid: boolean,
    onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void,
    formRef: React.RefObject<HTMLFormElement>,
  ) => {
    if (!isInvalid && !wasFocusReceivedSinceLastBlur && formRef.current) {
      setPreventFocusOnEditButton(true);
      if (formRef.current.checkValidity()) {
        onSubmit();
      }
    }
  };

  const renderReadView = () => {
    /* eslint-disable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
    return (
      <div
        css={css`
          line-height: 1;
        `}
      >
        <button
          css={editButtonStyles}
          aria-label={editButtonLabel}
          type="button"
          onClick={onEditRequested}
          ref={editButtonRef}
        />
        <div
          css={readViewContentWrapperStyles}
          onClick={onReadViewClick}
          onMouseDown={e => {
            startX = e.clientX;
            startY = e.clientY;
          }}
          data-read-view-fit-container-width={readViewFitContainerWidth}
        >
          {readView()}
        </div>
      </div>
    );
    /* eslint-enable jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions,jsx-a11y/no-noninteractive-element-interactions */
  };

  const buttonWrapperStyles = useMemo(() => getButtonWrapperStyles(mode), [
    mode,
  ]);

  const renderActionButtons = () => {
    return (
      <div css={buttonsContainerStyles}>
        <div css={buttonWrapperStyles}>
          <Button
            aria-label={confirmButtonLabel}
            type="submit"
            iconBefore={<ConfirmIcon label="Confirm" size="small" />}
            shouldFitContainer
            onMouseDown={() => {
              /** Prevents focus on edit button only if mouse is used to click button */
              setPreventFocusOnEditButton(true);
            }}
          />
        </div>
        <div css={buttonWrapperStyles}>
          <Button
            aria-label={cancelButtonLabel}
            iconBefore={<CancelIcon label="Cancel" size="small" />}
            onClick={onCancelClick}
            onMouseDown={() => {
              /** Prevents focus on edit button only if mouse is used to click button */
              setPreventFocusOnEditButton(true);
            }}
            shouldFitContainer
          />
        </div>
      </div>
    );
  };

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
  return (
    <Form onSubmit={(data: { inlineEdit: any }) => onConfirm(data.inlineEdit)}>
      {({ formProps: { onKeyDown, onSubmit, ref: formRef } }) => (
        <form
          onKeyDown={e => {
            onKeyDown(e);
            if (e.key === 'Esc' || e.key === 'Escape') {
              onCancel();
            }
          }}
          onSubmit={onSubmit}
          ref={formRef}
        >
          {isEditing ? (
            <Field
              name="inlineEdit"
              label={label}
              defaultValue={defaultValue}
              validate={validate}
              isRequired={isRequired}
              /**
               * This key is required so that value is reset when edit is
               * cancelled and defaultValue is ""
               */
              key="edit-view"
            >
              {({ fieldProps, error }) => (
                <div
                  css={css`
                    max-width: 100%;
                    position: relative;
                  `}
                  onBlur={() =>
                    onWrapperBlur(fieldProps.isInvalid, onSubmit, formRef)
                  }
                  onFocus={onWrapperFocus}
                >
                  {validate && (
                    <InlineDialog
                      isOpen={fieldProps.isInvalid}
                      content={<div id="error-message">{error}</div>}
                      placement="right"
                    >
                      <div
                        css={css`
                          height: 100%;
                          width: 100%;
                          position: absolute;
                          visibility: hidden;
                        `}
                      />
                    </InlineDialog>
                  )}
                  {editView(fieldProps)}
                  {!hideActionButtons ? (
                    renderActionButtons()
                  ) : (
                    /** This is to allow Ctrl + Enter to submit without action buttons */
                    <button
                      css={css`
                        display: none;
                      `}
                      type="submit"
                    />
                  )}
                </div>
              )}
            </Field>
          ) : (
            /** Field is used here only for the label */
            <Field
              name="inlineEdit"
              label={label}
              defaultValue=""
              isRequired={isRequired}
              /**
               * This key is required so that value is reset when edit is
               * cancelled and defaultValue is ""
               */
              key="read-view"
            >
              {renderReadView}
            </Field>
          )}
        </form>
      )}
    </Form>
  );
  /* eslint-enable jsx-a11y/no-noninteractive-element-interactions */
};

const InlineEditUncontrolled = <FieldValue extends any>(
  props: InlineEditUncontrolledProps<FieldValue>,
) => {
  return (
    <GlobalTheme.Consumer>
      {(tokens: GlobalThemeTokens) => {
        const mode = tokens.mode;
        return <InnerInlineEditUncontrolled {...props} mode={mode} />;
      }}
    </GlobalTheme.Consumer>
  );
};

export default InlineEditUncontrolled;
