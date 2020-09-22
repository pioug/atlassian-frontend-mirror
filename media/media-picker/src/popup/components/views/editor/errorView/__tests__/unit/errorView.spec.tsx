import React from 'react'; // eslint-disable-line
import Button from '@atlaskit/button/custom-theme-button';
import { messages } from '@atlaskit/media-ui';
import ConnectedErrorView from '../../errorView';

import {
  ErrorPopup,
  ErrorIconWrapper,
  ErrorMessage,
  ErrorHint,
} from '../../styles';
import { mountWithIntlContext } from '@atlaskit/media-test-helpers';

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
    expect(mainMessage.first().text()).toEqual(message);

    const hint = errorView.find(ErrorHint);
    expect(hint).toHaveLength(1);

    expect(hint.first().text()).toEqual(
      messages.error_hint_critical.defaultMessage,
    );

    const buttons = errorView.find(Button);
    expect(buttons).toHaveLength(1);
    expect(buttons.first().text()).toEqual(messages.close.defaultMessage);
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
    expect(mainMessage.first().text()).toEqual(message);

    const hint = errorView.find(ErrorHint);
    expect(hint).toHaveLength(1);
    expect(hint.first().text()).toEqual(
      messages.error_hint_retry.defaultMessage,
    );

    const buttons = errorView.find(Button);
    expect(buttons).toHaveLength(2);
    expect(buttons.at(0).text()).toEqual(messages.try_again.defaultMessage);
    expect(buttons.at(1).text()).toEqual(messages.cancel.defaultMessage);
  });
});
