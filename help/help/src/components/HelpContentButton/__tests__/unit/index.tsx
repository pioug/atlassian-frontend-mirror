import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import ShipIcon from '@atlaskit/icon/glyph/ship';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import HelpContentButton from '../../index';

const mockOnClick = jest.fn();
const analyticsSpy = jest.fn();
const buttonLabel = 'Test Content Button';
const notificationNumber = 5;

// Mockup notification Promise
class MockNotificationLogClient extends NotificationLogClient {
  notificationCounter: number;
  constructor(notificationCounter: number = notificationNumber) {
    super('', '');
    this.notificationCounter = notificationCounter;
  }

  public async countUnseenNotifications() {
    return Promise.resolve({ count: this.notificationCounter });
  }
}

describe('HelpContentButton', () => {
  it('Should match snapshot', async () => {
    const notificationsClient = new MockNotificationLogClient();
    const notificationLogProvider = Promise.resolve(notificationsClient);
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <HelpContentButton
          id="testHelpContentButton"
          href="https://www.atlassian.com/"
          notificationMax={9}
          notificationLogProvider={notificationLogProvider}
          text={buttonLabel}
          icon={<ShipIcon size="medium" label="" />}
          onClick={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { container } = render(component);

    await wait(() => notificationLogProvider);

    expect(container.firstChild).toMatchSnapshot();
  });

  it('Should display the notification icon with the number returned by the notificationLogProvider', async () => {
    const notificationsClient = new MockNotificationLogClient(5);
    const notificationLogProvider = Promise.resolve(notificationsClient);
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <HelpContentButton
          id="testHelpContentButton"
          href="https://www.atlassian.com/"
          notificationMax={9}
          notificationLogProvider={notificationLogProvider}
          text={buttonLabel}
          icon={<ShipIcon size="medium" label="" />}
          onClick={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    await wait(() => notificationLogProvider);

    const notificationCounterElm = queryByText(`${notificationNumber}`);
    expect(notificationCounterElm).not.toBeNull();
  });

  it(`Should display the notification icon with the number specified in the prop notificationMax
   followed by a "+" when the number returned by the notificationLogProvider if higher than the
   number specified in notificationMax`, async () => {
    const notificationsClient = new MockNotificationLogClient(20);
    const notificationLogProvider = Promise.resolve(notificationsClient);
    const notificationMax = 9;
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <HelpContentButton
          id="testHelpContentButton"
          href="https://www.atlassian.com/"
          notificationMax={notificationMax}
          notificationLogProvider={notificationLogProvider}
          text={buttonLabel}
          icon={<ShipIcon size="medium" label="" />}
          onClick={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    await wait(() => notificationLogProvider);

    const notificationCounterElm = queryByText(`${notificationMax}+`);
    expect(notificationCounterElm).not.toBeNull();
  });

  it(`Should not display the notification icon when notificationLogProvider is not defined`, async () => {
    const notificationMax = 9;
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <HelpContentButton
          id="testHelpContentButton"
          href="https://www.atlassian.com/"
          notificationMax={notificationMax}
          text={buttonLabel}
          icon={<ShipIcon size="medium" label="" />}
          onClick={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    const notificationCounterElm = queryByText(`${notificationNumber}`);
    expect(notificationCounterElm).not.toBeInTheDocument();
  });

  it(`Should not display the notification icon when notificationLogProvider is not defined`, async () => {
    const notificationMax = 9;
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <HelpContentButton
          id="testHelpContentButton"
          href="https://www.atlassian.com/"
          notificationMax={notificationMax}
          text={buttonLabel}
          icon={<ShipIcon size="medium" label="" />}
          onClick={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    const notificationCounterElm = queryByText(`${notificationNumber}`);
    expect(notificationCounterElm).toBeNull();
  });

  it(`Should display the Shortcut icon if the "href" prop is defined`, async () => {
    const notificationMax = 9;
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <HelpContentButton
          id="testHelpContentButton"
          href="https://www.atlassian.com/"
          notificationMax={notificationMax}
          text={buttonLabel}
          icon={<ShipIcon size="medium" label="" />}
          onClick={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByTestId } = render(component);

    const shortcutIcon = queryByTestId('shortcutIcon');
    expect(shortcutIcon).not.toBeNull();
  });

  it(`Should not display the Shortcut icon if the "href" is not defined`, async () => {
    const notificationMax = 9;
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <HelpContentButton
          id="testHelpContentButton"
          notificationMax={notificationMax}
          text={buttonLabel}
          icon={<ShipIcon size="medium" label="" />}
          onClick={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByTestId } = render(component);

    const shortcutIcon = queryByTestId('shortcutIcon');
    expect(shortcutIcon).toBeNull();
  });

  it('Should call handleOnClick when the user click the button', () => {
    const notificationMax = 9;
    const component = (
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <HelpContentButton
          id="testHelpContentButton"
          notificationMax={notificationMax}
          text={buttonLabel}
          icon={<ShipIcon size="medium" label="" />}
          onClick={mockOnClick}
        />
      </AnalyticsListener>
    );
    const { queryByText } = render(component);

    const button = queryByText(buttonLabel);
    expect(button).not.toBeNull();

    if (button) {
      fireEvent.click(button);
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    }
  });
});
