import React from 'react';

import { fireEvent, render, waitFor } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import noop from '@atlaskit/ds-lib/noop';

import Tag, { type RemovableTagProps } from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Tag analytics', () => {
  const tagProps: RemovableTagProps = {
    testId: 'tag',
    text: 'Post Removal Hook',
    removeButtonLabel: 'Remove',
    isRemovable: true,
    onBeforeRemoveAction: () => {
      return true;
    },
    onAfterRemoveAction: noop,
  };

  it('should listen to analytics event on tag removal', async () => {
    const onAtlaskitEvent = jest.fn();
    const { getByLabelText } = render(
      <AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
        <div>
          <Tag {...tagProps} />,
        </div>
      </AnalyticsListener>,
    );
    const expected: UIAnalyticsEvent[] = [
      // Initial click
      new UIAnalyticsEvent({
        payload: {
          action: 'clicked',
          actionSubject: 'button',
          attributes: {
            componentName: 'Pressable',
            packageName,
            packageVersion,
          },
        },
      }),
      // After removal
      new UIAnalyticsEvent({
        payload: {
          action: 'removed',
          actionSubject: 'tag',
          attributes: {
            componentName: 'tag',
            packageName,
            packageVersion,
          },
        },
      }),
    ];

    fireEvent.click(getByLabelText('Remove Post Removal Hook'));

    await waitFor(() => {
      const mock: jest.Mock = onAtlaskitEvent;
      expect(mock).toHaveBeenCalledTimes(2);
      expect(mock.mock.calls[0][0].payload).toEqual(expected[0].payload);
      expect(mock.mock.calls[1][0].payload).toEqual(expected[1].payload);
    });
  });
});
