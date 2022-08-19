import React from 'react';

import { renderWithIntl as render } from '@atlaskit/link-test-helpers';
import { fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { LinkPickerProps } from '../../../';
import { ANALYTICS_CHANNEL } from '../../../common/constants';
import LinkPicker, { testIds } from '../../link-picker';

describe('LinkPicker analytics', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupLinkPicker = ({
    url = '',
    plugins,
    ...props
  }: Partial<LinkPickerProps> = {}) => {
    const spy = jest.fn();

    render(
      <AnalyticsListener channel={ANALYTICS_CHANNEL} onEvent={spy}>
        <LinkPicker
          url={url}
          onSubmit={jest.fn()}
          plugins={plugins ?? []}
          onCancel={jest.fn()}
          onContentResize={jest.fn()}
          {...props}
        />
      </AnalyticsListener>,
    );

    return {
      spy,
      testIds,
    };
  };

  it('should fire `form.submitted.linkPicker` on form submission', async () => {
    const { spy, testIds } = setupLinkPicker();

    await userEvent.type(
      screen.getByTestId(testIds.urlInputField),
      'www.atlassian.com',
    );

    fireEvent.submit(screen.getByTestId(testIds.urlInputField));

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        hasFired: true,
        payload: {
          action: 'submitted',
          eventType: 'ui',
          actionSubject: 'form',
          actionSubjectId: 'linkPicker',
          attributes: {},
        },
      }),
      ANALYTICS_CHANNEL,
    );
  });
});
