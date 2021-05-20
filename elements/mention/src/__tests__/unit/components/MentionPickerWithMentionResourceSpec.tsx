import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { ReactWrapper } from 'enzyme';
import 'es6-promise/auto'; // 'whatwg-fetch' needs a Promise polyfill

import fetchMock from 'fetch-mock/cjs/client';
import React from 'react';
import MentionResource from '../../../api/MentionResource';
import { MentionPicker, Props, State } from '../../../components/MentionPicker';
import { MentionsResult } from '../../../types';
import * as UtilAnalytics from '../../../util/analytics';
import { resultC } from '../_mention-search-results';

const mentionResource = new MentionResource({
  url: 'boo.com/mentions',
});

function setupPicker(props?: Props): ReactWrapper<Props, State> {
  return mountWithIntl(
    <MentionPicker
      resourceProvider={mentionResource}
      query=""
      createAnalyticsEvent={jest.fn()}
      {...props}
    />,
  ) as ReactWrapper<Props, State>;
}

describe('MentionPicker', () => {
  const query = 'c';
  const props = { query } as Props;
  const mentionsResult: MentionsResult = {
    mentions: resultC,
    query,
  };
  let fireAnalyticsMock: jest.SpyInstance;
  let fireAnalyticsReturn: jest.Mock;

  beforeEach(() => {
    fireAnalyticsMock = jest.spyOn(
      UtilAnalytics,
      'fireAnalyticsMentionTypeaheadEvent',
    );
    fireAnalyticsReturn = jest.fn();
    fireAnalyticsMock.mockReturnValue(fireAnalyticsReturn);

    fetchMock.mock(/\/mentions\/search\?.*query=c(&|$)/, {
      body: {
        mentions: resultC,
      },
    });

    setupPicker(props);
  });

  afterEach(() => {
    fetchMock.restore();
    fireAnalyticsMock.mockReset();
    fireAnalyticsReturn.mockReset();
  });

  it('should fire analytics when new mention data is fetched', () => {
    mentionResource.notify(Date.now(), mentionsResult, query);

    return new Promise((resolve) => window.setTimeout(resolve)).then(() => {
      expect(fireAnalyticsMock).toHaveBeenCalled();

      const firstArgument = fireAnalyticsMock.mock.calls[0][0];
      expect(firstArgument.query).toBe(query);

      expect(fireAnalyticsReturn).toHaveBeenCalledWith(
        'rendered',
        expect.any(Number),
        [
          '1810620',
          '1293711',
          '2866665',
          '89149',
          '1122770',
          '1384515',
          '372531',
          '357702',
          '2011825',
          '84107',
        ],
        query,
      );
    });
  });
});
