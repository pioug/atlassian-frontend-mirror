import { AnalyticsContext } from '@atlaskit/analytics-next';
import { render } from '@testing-library/react';
import React from 'react';
import createNamespaceContext from '../helper/createNamespaceContext';

jest.mock('@atlaskit/analytics-next', () => ({
  AnalyticsContext: jest
    .fn()
    .mockImplementation((props) => <div>{props.children}</div>),
}));

type Props = {
  data: string;
};

describe('createNamespaceContext', () => {
  test('calls AnalyticsContext with proper namespace for data', () => {
    const Component = createNamespaceContext<Props>('testNamespace');

    render(
      <Component data={'test-data'}>
        <div />
      </Component>,
    );

    expect(AnalyticsContext).toHaveBeenCalledWith(
      expect.objectContaining({ data: { testNamespace: 'test-data' } }),
      expect.anything(),
    );
  });
});
