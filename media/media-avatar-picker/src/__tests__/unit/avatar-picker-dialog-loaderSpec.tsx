import React from 'react';
import { mount } from 'enzyme';
import { nextTick } from '@atlaskit/media-test-helpers';

import AsyncAvatarPickerDialog, {
  AsyncAvatarPickerDialogProps,
  AsyncAvatarPickerDialogState,
} from '../../avatar-picker-dialog/avatar-picker-dialog-loader';

const props = {
  avatars: [{ dataURI: 'http://an.avatar.com/453' }],
  onAvatarPicked: jest.fn(),
  onImagePicked: jest.fn(),
  onImagePickedDataURI: jest.fn(),
  onCancel: jest.fn(),
};

describe('AvatarPickerDialog Async Loader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the async import returns with error', () => {
    beforeEach(() => {
      jest.mock('../../avatar-picker-dialog/index', () => {
        throw new Error('Forcing async import error');
      });
    });

    it('should NOT render AvatarPickerDialog component', () => {
      const wrapper = mount<
        AsyncAvatarPickerDialogProps,
        AsyncAvatarPickerDialogState
      >(<AsyncAvatarPickerDialog {...props} />);

      expect(wrapper.state().AvatarPickerDialog).toBeUndefined();
    });
  });

  describe('When the async import returns with success', () => {
    beforeEach(() => {
      jest.unmock('../../avatar-picker-dialog/index');
    });

    it('should render AvatarPickerDialog component', async () => {
      const wrapper = await mount<
        AsyncAvatarPickerDialogProps,
        AsyncAvatarPickerDialogState
      >(<AsyncAvatarPickerDialog {...props} />);

      await nextTick();

      expect(wrapper.state().AvatarPickerDialog).not.toBeUndefined();
    });
  });
});
