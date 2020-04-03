import React from 'react';
// import { mountWithIntlContext } from 'enzyme';
import { nextTick, mountWithIntlContext } from '@atlaskit/media-test-helpers';

import { ModalSpinner } from '@atlaskit/media-ui';
import AsyncEditorView, { AsyncEditorViewState } from '../editorViewLoader';

const props = {
  imageUrl: 'file://./atlassian.png',
  onCancel: jest.fn(),
  onSave: jest.fn(),
  onError: jest.fn(),
};

describe('Async Editor View Loader', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When the async import returns with error', () => {
    beforeEach(() => {
      jest.mock('../editorView', () => {
        throw new Error('Forcing async import error');
      });
    });

    it('should render ModalSpinner without blankedColor if the async components were NOT resolved', async () => {
      const wrapper = mountWithIntlContext<{}, AsyncEditorViewState>(
        <AsyncEditorView {...props} />,
      );

      await nextTick();

      expect(wrapper.find(ModalSpinner).prop('blankedColor')).toEqual('none');

      expect(wrapper.state().EditorView).toBeUndefined();
    });
  });

  describe('When the async import returns with success', () => {
    beforeEach(() => {
      jest.unmock('../editorView');
    });

    it('should render EditorView component', async () => {
      const wrapper = await mountWithIntlContext<{}, AsyncEditorViewState>(
        <AsyncEditorView {...props} />,
      );

      await nextTick();

      expect(wrapper.state().EditorView).not.toBeUndefined();
    });
  });
});
