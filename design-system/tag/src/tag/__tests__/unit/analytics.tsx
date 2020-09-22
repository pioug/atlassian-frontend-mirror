import React from 'react';

import { fireEvent, render, wait } from '@testing-library/react';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import {
  name as packageName,
  version as packageVersion,
} from '../../../version.json';
import Tag, { RemovableTagProps } from '../../index';

describe('Tag analytics', () => {
  const tagProps: RemovableTagProps = {
    testId: 'tag',
    text: 'Post Removal Hook',
    removeButtonLabel: 'Remove',
    isRemovable: true,
    onBeforeRemoveAction: () => {
      return true;
    },
    onAfterRemoveAction: () => {},
  };

  it('should listen to analytcis event on tag removal', async () => {
    const onAtlaskitEvent = jest.fn();
    const { getByLabelText } = render(
      <AnalyticsListener onEvent={onAtlaskitEvent} channel="atlaskit">
        <div>
          <Tag {...tagProps} />,
        </div>
      </AnalyticsListener>,
    );
    const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
      payload: {
        action: 'removed',
        actionSubject: 'tag',
        attributes: {
          componentName: 'tag',
          packageName,
          packageVersion,
        },
      },
    });
    fireEvent.click(getByLabelText('Remove'));

    await wait(() => {
      const mock: jest.Mock = onAtlaskitEvent;
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock.mock.calls[0][0].payload).toEqual(expected.payload);
    });
  });
});
