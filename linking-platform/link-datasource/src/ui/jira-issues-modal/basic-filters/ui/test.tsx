import React from 'react';

import { render } from '@testing-library/react';

import AsyncPopupSelect from './async-popup-select';

import BasicFilterContainer from './index';

jest.mock('./async-popup-select', () => jest.fn(() => <div></div>));

describe('BasicFilterContainer', () => {
  it('renders AsyncPopupSelect with correct cloudId and filterType', () => {
    const availableBasicFilterTypes = [
      'project',
      'issuetype',
      'status',
      'assignee',
    ];

    const cloudId = 'test-cloud-id';
    const jql = '';

    render(<BasicFilterContainer cloudId={cloudId} jql={jql} />);

    availableBasicFilterTypes.map((filterType, index) => {
      expect(AsyncPopupSelect).toHaveBeenNthCalledWith(
        index + 1, // nth call
        expect.objectContaining({
          cloudId,
          filterType,
        }),
        {}, // empty context
      );
    });
  });
});
