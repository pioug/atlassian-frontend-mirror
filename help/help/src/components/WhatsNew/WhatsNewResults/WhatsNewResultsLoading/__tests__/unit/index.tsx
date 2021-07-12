import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';

import { WhatsNewResultsLoading } from '../../index';

const intlProvider = new IntlProvider({ locale: 'en' });
const { intl } = intlProvider.getChildContext();

const analyticsSpy = jest.fn();

describe('WhatsNewResultsLoading', () => {
  it('Should match snapshot', () => {
    const { container } = render(
      <AnalyticsListener channel="help" onEvent={analyticsSpy}>
        <WhatsNewResultsLoading intl={intl} />
      </AnalyticsListener>,
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
