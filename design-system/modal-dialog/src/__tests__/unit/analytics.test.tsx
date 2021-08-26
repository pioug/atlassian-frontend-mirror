import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { AnalyticsListener } from '@atlaskit/analytics-next';

import ModalDialog, { ModalTransition } from '../../index';

describe('modal dialog analytics', () => {
  it('should fire analytics when the modal dialog is closed from within', () => {
    const callback = jest.fn();

    render(
      <AnalyticsListener channel="atlaskit" onEvent={callback}>
        <ModalTransition>
          <ModalDialog testId="modal-analytics" />
        </ModalTransition>
      </AnalyticsListener>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(callback.mock.calls[0][0].context).toEqual([
      {
        componentName: 'modalDialog',
        packageName: '@atlaskit/fabric',
        packageVersion: '0.0.0',
      },
    ]);
    expect(callback.mock.calls[0][0].payload).toEqual({
      action: 'closed',
      actionSubject: 'modalDialog',
      attributes: {
        componentName: 'modalDialog',
        packageName: '@atlaskit/fabric',
        packageVersion: '0.0.0',
      },
    });
  });

  it('should callback with the analytic event on close', () => {
    const callback = jest.fn();

    render(
      <AnalyticsListener channel="atlaskit" onEvent={jest.fn()}>
        <ModalTransition>
          <ModalDialog onClose={callback} testId="modal-analytics" />
        </ModalTransition>
      </AnalyticsListener>,
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(callback.mock.calls[0][1].context).toEqual([
      {
        componentName: 'modalDialog',
        packageName: '@atlaskit/fabric',
        packageVersion: '0.0.0',
      },
    ]);
    expect(callback.mock.calls[0][1].payload).toEqual({
      action: 'closed',
      actionSubject: 'modalDialog',
      attributes: {
        componentName: 'modalDialog',
        packageName: '@atlaskit/fabric',
        packageVersion: '0.0.0',
      },
    });
  });
});
