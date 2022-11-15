import React from 'react';
import { Provider, Client } from '../src';
import { EnvironmentsKeys } from '@atlaskit/link-provider';
import { LoadingCardLink } from '../src/view/CardWithUrl/component-lazy/LazyFallback';
import { AnalyticsPayload } from '../src/utils/types';

class BrokenClient extends Client {
  constructor(config: EnvironmentsKeys) {
    super(config);
  }
  fetchData(url: string): Promise<any> {
    return Promise.reject('error');
  }
}
export default () => (
  <Provider client={new BrokenClient('stg')}>
    <div style={{ width: '680px', margin: '0 auto', marginTop: '64px' }}>
      This is a placeholder for a Smart Link with the text override!
      <br />
      <LoadingCardLink
        url={'http://some.url'}
        placeholder={'spaghetti'}
        id={''}
        appearance={'inline'}
        dispatchAnalytics={function (event: AnalyticsPayload): void {
          throw new Error('Function not implemented.');
        }}
      />
      <br />
      This is a placeholder for a Smart Link!
      <br />
      <LoadingCardLink
        url={'http://some.url'}
        id={''}
        appearance={'inline'}
        dispatchAnalytics={function (event: AnalyticsPayload): void {
          throw new Error('Function not implemented.');
        }}
      />
    </div>
  </Provider>
);
