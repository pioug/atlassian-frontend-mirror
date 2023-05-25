import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import '@atlaskit/link-test-helpers/jest';
import { AnalyticsListener } from '@atlaskit/analytics-next';

import { withLinkClickedEvent } from '../click';

describe('withLinkClickedEvent', () => {
  describe.each([['native `a` tag', withLinkClickedEvent('a')]])(
    'should support %s',
    (_, Component) => {
      const setup = () => {
        const user = userEvent.setup();

        const spy = jest.fn();
        const onClick = jest.fn((e) => e.preventDefault());
        const onMouseDown = jest.fn((e) => e.preventDefault());

        const wrapper = render(
          <AnalyticsListener onEvent={spy} channel="*">
            <Component
              href="https://atlassian.com"
              onClick={onClick}
              onMouseDown={onMouseDown}
            />
          </AnalyticsListener>,
        );

        return { user, onClick, onMouseDown, wrapper, spy };
      };

      it('should cause wrapped component to fire `link clicked` on left click', async () => {
        const { user, spy } = setup();

        const link = await screen.findByRole('link');
        await user.click(link);

        expect(spy).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'clicked',
            actionSubject: 'link',
            eventType: 'ui',
            attributes: {
              clickType: 'left',
              clickOutcome: 'clickThrough',
              keysHeld: [],
            },
          },
        });
        expect(spy).not.toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'clicked',
            actionSubject: 'link',
            eventType: 'ui',
            attributes: {
              clickType: 'right',
            },
          },
        });
      });

      it('should cause wrapped component to fire `link clicked` on right click', async () => {
        const { user, spy } = setup();

        const link = await screen.findByRole('link');
        await user.pointer({ target: link, keys: '[MouseRight]' });

        expect(spy).toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'clicked',
            actionSubject: 'link',
            eventType: 'ui',
            attributes: {
              clickType: 'right',
              clickOutcome: 'contextMenu',
              keysHeld: [],
            },
          },
        });
        expect(spy).not.toBeFiredWithAnalyticEventOnce({
          payload: {
            action: 'clicked',
            actionSubject: 'link',
            eventType: 'ui',
            attributes: {
              clickType: 'left',
            },
          },
        });
      });

      it('should support `onClick` and `onMouseDown` props', async () => {
        const { user, onClick, onMouseDown } = setup();

        const link = await screen.findByRole('link');
        await user.click(link);
        expect(onClick).toHaveBeenCalled();
        expect(onMouseDown).toHaveBeenCalled();

        jest.clearAllMocks();
        await user.pointer({ target: link, keys: '[MouseRight]' });
        expect(onClick).not.toHaveBeenCalled();
        expect(onMouseDown).toHaveBeenCalled();
      });
    },
  );
});
