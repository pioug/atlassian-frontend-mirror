import React from 'react'; // eslint-disable-line
import Button from '@atlaskit/button/custom-theme-button';
import { messages } from '@atlaskit/media-ui';
import {
  expectToEqual,
  mountWithIntlContext,
} from '@atlaskit/media-test-helpers';

import ConnectedErrorView from '../../errorView';

import {
  ErrorPopup,
  ErrorIconWrapper,
  ErrorMessage,
  ErrorHint,
} from '../../styles';

describe('ErrorView', () => {
  const message = 'some-message';
  const onRetry = () => {};
  const onCancel = () => {};

  it('should display one button in case of critical error', () => {
    const errorView = mountWithIntlContext(
      <ConnectedErrorView message={message} onCancel={onCancel} />,
    );
    expect(errorView.find(ErrorPopup)).toHaveLength(1);
    expect(errorView.find(ErrorIconWrapper)).toHaveLength(1);

    const mainMessage = errorView.find(ErrorMessage);
    expect(mainMessage).toHaveLength(1);
    expectToEqual(mainMessage.first().text(), message);

    const hint = errorView.find(ErrorHint);
    expect(hint).toHaveLength(1);

    expectToEqual(
      hint.first().text(),
      messages.error_hint_critical.defaultMessage,
    );

    const buttons = errorView.find(Button);
    expect(buttons).toHaveLength(1);
    expectToEqual(buttons.first().text(), messages.close.defaultMessage);
  });

  it('should display two buttons in case of retriable error', () => {
    const errorView = mountWithIntlContext(
      <ConnectedErrorView
        message={message}
        onRetry={onRetry}
        onCancel={onCancel}
      />,
    );
    expect(errorView.find(ErrorPopup)).toHaveLength(1);
    expect(errorView.find(ErrorIconWrapper)).toHaveLength(1);

    const mainMessage = errorView.find(ErrorMessage);
    expect(mainMessage).toHaveLength(1);
    expectToEqual(mainMessage.first().text(), message);

    const hint = errorView.find(ErrorHint);
    expect(hint).toHaveLength(1);
    expectToEqual(
      hint.first().text(),
      messages.error_hint_retry.defaultMessage,
    );

    const buttons = errorView.find(Button);
    expect(buttons).toHaveLength(2);
    expectToEqual(buttons.at(0).text(), messages.try_again.defaultMessage);
    expectToEqual(buttons.at(1).text(), messages.cancel.defaultMessage);
  });
});
