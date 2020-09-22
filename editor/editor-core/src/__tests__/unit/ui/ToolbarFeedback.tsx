import { mount, ReactWrapper } from 'enzyme';
import React from 'react';
import PropTypes from 'prop-types';
import AkButton from '@atlaskit/button/standard-button';
import { Popup } from '@atlaskit/editor-common';
import ToolbarFeedback from '../../../ui/ToolbarFeedback';
import { openFeedbackDialog } from '../../../plugins/feedback-dialog';
import { analyticsEventKey } from '../../../plugins/analytics/consts';

jest.mock('../../../plugins/feedback-dialog', () => ({
  openFeedbackDialog: jest.fn(),
}));

describe('@atlaskit/editor-core/ui/ToolbarFeedback', () => {
  let toolbarOption: ReactWrapper;

  beforeAll(() => {
    window.jQuery = { ajax: () => {} };
  });

  afterAll(() => {
    if (window.jQuery) {
      delete window.jQuery;
    }
  });

  const mockEventDispatcher: { emit: jest.Mock } = { emit: jest.fn() };

  function mountWithEditorActions(props = {}) {
    const context = {
      editorActions: { eventDispatcher: mockEventDispatcher },
    };
    const childContextTypes = {
      editorActions: PropTypes.object.isRequired,
    };
    toolbarOption = mount(<ToolbarFeedback {...props} />, {
      context,
      childContextTypes,
    });
  }

  describe('analytics', () => {
    afterEach(() => {
      if (toolbarOption) {
        toolbarOption.unmount();
      }
    });

    it('should trigger feedback button clicked analytics event when feedback icon clicked', () => {
      mountWithEditorActions();

      toolbarOption.find(AkButton).simulate('click');
      expect(mockEventDispatcher.emit).toHaveBeenCalledWith(analyticsEventKey, {
        payload: {
          action: 'clicked',
          actionSubject: 'button',
          actionSubjectId: 'feedbackButton',
          eventType: 'ui',
        },
      });
    });
  });

  it('should open opt out popup for bitbucket when feedback icon is clicked', () => {
    const toolbarOption = mount(<ToolbarFeedback product="bitbucket" />);
    expect(toolbarOption.find(Popup).length).toEqual(0);
    toolbarOption.find(AkButton).simulate('click');
    expect(toolbarOption.find(Popup).length).toEqual(1);
    toolbarOption.unmount();
  });

  describe('openFeedbackDialog', () => {
    beforeEach(() => {
      mountWithEditorActions({
        packageName: 'editor',
        packageVersion: '1.1.1',
        labels: ['label1', 'label2'],
      });
      toolbarOption.find(AkButton).simulate('click');
    });

    afterEach(() => {
      if (toolbarOption) {
        toolbarOption.unmount();
      }
    });

    it('should call openFeedbackDialog with correct params', () => {
      expect(openFeedbackDialog).toHaveBeenCalledWith({
        packageName: 'editor',
        packageVersion: '1.1.1',
        labels: ['label1', 'label2'],
      });
    });
  });
});
