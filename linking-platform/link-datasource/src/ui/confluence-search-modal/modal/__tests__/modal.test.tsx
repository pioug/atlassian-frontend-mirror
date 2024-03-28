import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';
import { mockSiteData } from '@atlaskit/link-test-helpers/datasource';
import { asMock } from '@atlaskit/link-test-helpers/jest';

import SmartLinkClient from '../../../../../examples-helpers/smartLinkCustomClient';
import { getAvailableSites } from '../../../../services/getAvailableSites';
import { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../../index';
import { ConfluenceSearchConfigModalProps } from '../../types';
import { ConfluenceSearchConfigModal } from '../index';

jest.mock('../../../../services/getAvailableSites', () => ({
  getAvailableSites: jest.fn(),
}));

const searchId = 'confluence-search-datasource-modal';

describe('ConfluenceSearchConfigModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const onCancel = jest.fn();
  const onInsert = jest.fn();

  const setup = async (props?: ConfluenceSearchConfigModalProps) => {
    asMock(getAvailableSites).mockResolvedValue(mockSiteData);

    const spy = jest.fn();

    render(
      <IntlProvider locale="en">
        <SmartCardProvider client={new SmartLinkClient()}>
          <ConfluenceSearchConfigModal
            {...props}
            datasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}
            onCancel={onCancel}
            onInsert={onInsert}
          />
        </SmartCardProvider>
      </IntlProvider>,
    );
    return { spy };
  };

  describe('Renders modal and', () => {
    it('should display with initial state', async () => {
      await setup();

      expect(await screen.findByTestId(searchId)).toBeInTheDocument();

      expect(
        screen.queryByTestId('datasource-modal--initial-state-view'),
      ).toBeTruthy();
    });

    it('should call onCancel when cancel button is clicked', async () => {
      await setup();

      expect(await screen.findByTestId(searchId)).toBeInTheDocument();

      const button = await screen.findByRole('button', { name: 'Cancel' });
      button.click();
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('should display a site selector with a title', async () => {
      await setup();

      expect(await screen.findByTestId(searchId)).toBeInTheDocument();

      expect(
        await screen.findByTestId(
          'confluence-search-datasource-modal--site-selector--trigger',
        ),
      ).toBeInTheDocument();
      expect(
        await screen.findByText('Insert Confluence list from'),
      ).toBeInTheDocument();
    });
  });
});
