/** @jsx jsx */
import React, { useCallback, useRef, useState } from 'react';

import { css, jsx } from '@emotion/core';

import {
  UIAnalyticsEvent,
  usePlatformLeafEventHandler,
} from '@atlaskit/analytics-next';
import Field from '@atlaskit/form/Field';
import Form from '@atlaskit/form/Form';
import GlobalTheme from '@atlaskit/theme/components';
import { GlobalThemeTokens, ThemeModes } from '@atlaskit/theme/types';

import Buttons from './internal/buttons';
import useButtonFocusHook from './internal/hooks/use-button-focus-hook';
import ReadView from './internal/read-view';
import { InlineEditProps } from './types';

const analyticsAttributes = {
  componentName: 'inlineEdit',
  packageName: process.env._PACKAGE_NAME_ as string,
  packageVersion: process.env._PACKAGE_VERSION_ as string,
};
interface ExtendedInlineEditProps<FieldValue>
  extends InlineEditProps<FieldValue> {
  mode: ThemeModes;
}

const noop = () => {};

const InnerInlineEdit = <FieldValue extends unknown>(
  props: ExtendedInlineEditProps<FieldValue>,
) => {
  const {
    startWithEditViewOpen = false,
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
    analyticsContext,
    onConfirm: providedOnConfirm,
    onCancel: providedOnCancel = noop,
    onEdit: providedOnEdit = noop,
    mode,
  } = props;

  const wasFocusReceivedSinceLastBlurRef = useRef(false);
  const isControlled = typeof isEditing === 'undefined';
  const [isEditingState, setEditingState] = useState(startWithEditViewOpen);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const {
    editButtonRef,
    editViewRef,
    shouldBeEditing,
    doNotFocusOnEditButton,
  } = useButtonFocusHook(isEditing, isEditingState);

  const onCancel = useCallback(() => {
    if (isControlled) {
      setEditingState(false);
    }
    providedOnCancel();
  }, [isControlled, providedOnCancel]);

  const onEditRequested = useCallback(() => {
    if (isControlled) {
      setEditingState(true);
    }
    providedOnEdit();
    if (shouldBeEditing && editViewRef.current) {
      editViewRef.current.focus();
    }
  }, [isControlled, shouldBeEditing, editViewRef, providedOnEdit]);

  const onConfirm = usePlatformLeafEventHandler({
    fn: (value: string, analyticsEvent: UIAnalyticsEvent) => {
      if (isControlled) {
        setEditingState(false);
      }
      providedOnConfirm(value, analyticsEvent);
    },
    action: 'confirmed',
    analyticsData: analyticsContext,
    ...analyticsAttributes,
  });

  const onCancelClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      onCancel();
    },
    [onCancel],
  );

  const tryAutoSubmitWhenBlur = useCallback(
    (
      isFieldInvalid: boolean,
      onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void,
      formRef: React.RefObject<HTMLFormElement>,
    ) => {
      if (
        !isFieldInvalid &&
        !wasFocusReceivedSinceLastBlurRef.current &&
        formRef.current
      ) {
        doNotFocusOnEditButton();
        if (formRef.current.checkValidity()) {
          onSubmit();
        }
      }
    },
    [doNotFocusOnEditButton],
  );

  /** If keepEditViewOpenOnBlur prop is set to false, will call confirmIfUnfocused() which
   *  confirms the value, if the focus is not transferred to the action buttons
   *
   *  When you're in `editing` state, the focus will be on the input field. And if you use keyboard
   *  to navigate to `submit` button, this function will be invoked. Then function `onEditViewWrapperFocus`
   *  will be called, the timeout used here is making sure `onEditViewWrapperFocus` is always called before
   *  `autoSubmitWhenBlur`.
   *
   *  There are two paths here the function can be triggered:
   *
   *  - focus on input first, and then use keyboard to `submit`
   *  - focus on input first, and then click anywhere else on the page (outside of edit view wrapper) to `submit` (auto save)
   */
  const onEditViewWrapperBlur = useCallback(
    (
      isFieldInvalid: boolean,
      onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void,
      formRef: React.RefObject<HTMLFormElement>,
    ) => {
      if (!keepEditViewOpenOnBlur) {
        wasFocusReceivedSinceLastBlurRef.current = false;
        timerRef.current = setTimeout(
          () => tryAutoSubmitWhenBlur(isFieldInvalid, onSubmit, formRef),
          0,
        );
      }
    },
    [keepEditViewOpenOnBlur, tryAutoSubmitWhenBlur],
  );

  /** Gets called when focus is transferred to the editView, or action buttons
   *
   * There are three paths here the function can be called:
   *
   * - when a user click the `editView`
   * - when a user use keyboard to tab into `editView`
   * - when a user use keyboard to tab into `submit` when they were on input field
   */
  const onEditViewWrapperFocus = useCallback(() => {
    wasFocusReceivedSinceLastBlurRef.current = true;
  }, []);

  const renderReadView = () => {
    return (
      <ReadView
        editButtonLabel={editButtonLabel}
        onEditRequested={onEditRequested}
        postReadViewClick={doNotFocusOnEditButton}
        editButtonRef={editButtonRef}
        readViewFitContainerWidth={readViewFitContainerWidth}
        readView={readView}
      />
    );
  };

  /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
  return (
    <Form onSubmit={(data: { inlineEdit: any }) => onConfirm(data.inlineEdit)}>
      {({ formProps: { onKeyDown, onSubmit, ref: formRef } }) => (
        <form
          onKeyDown={(e) => {
            onKeyDown(e);
            if (e.key === 'Esc' || e.key === 'Escape') {
              onCancel();
            }
          }}
          onSubmit={onSubmit}
          ref={formRef}
        >
          {shouldBeEditing ? (
            <Field
              name="inlineEdit"
              label={label}
              defaultValue={defaultValue}
              validate={validate}
              isRequired={isRequired}
              key="edit-view" // used for reset to default value
            >
              {({ fieldProps, error }) => (
                <div
                  css={css`
                    max-width: 100%;
                    position: relative;
                  `}
                  onBlur={() => {
                    onEditViewWrapperBlur(
                      fieldProps.isInvalid,
                      onSubmit,
                      formRef,
                    );
                  }}
                  onFocus={onEditViewWrapperFocus}
                >
                  {editView(
                    {
                      ...fieldProps,
                      errorMessage: error,
                    },
                    editViewRef,
                  )}
                  {!hideActionButtons ? (
                    <Buttons
                      cancelButtonLabel={cancelButtonLabel}
                      confirmButtonLabel={confirmButtonLabel}
                      onMouseDown={() => {
                        /** Prevents focus on edit button only if mouse is used to click button, but not when keyboard is used */
                        doNotFocusOnEditButton();
                      }}
                      mode={mode}
                      onCancelClick={onCancelClick}
                    />
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
              key="read-view" // used for reset to default value
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

const InlineEdit = <FieldValue extends unknown = string>(
  props: InlineEditProps<FieldValue>,
) => {
  return (
    <GlobalTheme.Consumer>
      {(tokens: GlobalThemeTokens) => {
        const mode = tokens.mode;
        return <InnerInlineEdit<FieldValue> {...props} mode={mode} />;
      }}
    </GlobalTheme.Consumer>
  );
};

export default InlineEdit;
