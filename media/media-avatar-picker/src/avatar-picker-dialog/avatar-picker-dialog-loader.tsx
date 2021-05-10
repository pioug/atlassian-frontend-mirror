import React from 'react';
import { ReactNode } from 'react';
import { ModalSpinner } from '@atlaskit/media-ui';

import { AvatarPickerDialog } from '.';
import { AvatarPickerDialogProps } from './types';

export interface AsyncAvatarPickerDialogState {
  AvatarPickerDialog?: typeof AvatarPickerDialog;
}

export type AsyncAvatarPickerDialogProps = AvatarPickerDialogProps & {
  placeholder?: ReactNode;
};

export default class AsyncAvatarPickerDialog extends React.PureComponent<
  AsyncAvatarPickerDialogProps,
  AsyncAvatarPickerDialogState
> {
  static displayName = 'AsyncAvatarPickerDialog';
  static AvatarPickerDialog?: typeof AvatarPickerDialog;

  state = {
    // Set state value to equal to current static value of this class.
    AvatarPickerDialog: AsyncAvatarPickerDialog.AvatarPickerDialog,
  };

  async UNSAFE_componentWillMount() {
    if (!this.state.AvatarPickerDialog) {
      try {
        const module = await import(
          /* webpackChunkName: "@atlaskit-internal_media-avatar-picker" */
          '.'
        );
        AsyncAvatarPickerDialog.AvatarPickerDialog = module.AvatarPickerDialog;
        this.setState({ AvatarPickerDialog: module.AvatarPickerDialog });
      } catch (error) {
        // TODO [MS-2272]: Add operational error to catch async import error
      }
    }
  }

  render() {
    if (!this.state.AvatarPickerDialog) {
      const { placeholder } = this.props;
      if (placeholder) {
        return placeholder;
      }

      return (
        <ModalSpinner
          blankedColor="rgba(255, 255, 255, 0.53)"
          invertSpinnerColor={false}
        />
      );
    }

    return <this.state.AvatarPickerDialog {...this.props} />;
  }
}
