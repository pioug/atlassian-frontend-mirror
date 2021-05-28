import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';
import { act } from '@testing-library/react-hooks';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
import { FormErrorBoundaryImpl } from '../../FormErrorBoundary';
import { flushPromises } from '../../../../__tests__/__helpers/utils';

const BadComponent = () => {
  throw new Error('This should fail');
};

describe('FormErrorBoundary', () => {
  const mountBoundary = (createAnalyticsEvent: any) => {
    const contextIdentifierProvider = {
      containerId: '',
      objectId: '',
      product: 'test',
    };
    const exampleFields: FieldDefinition[] = [
      { type: 'string', name: 'example', label: 'Username' },
    ];

    return mount(
      <IntlProvider locale="en">
        <FormErrorBoundaryImpl
          contextIdentifierProvider={contextIdentifierProvider}
          createAnalyticsEvent={createAnalyticsEvent}
          extensionKey="atlassian.confluence.table-viz"
          fields={exampleFields}
        >
          <BadComponent />
        </FormErrorBoundaryImpl>
      </IntlProvider>,
    );
  };

  describe('Error boundary', () => {
    it('should show error boundary if FormContent crashes unexpectedly', async () => {
      const mockCreateAnalyticsEvent = jest.fn().mockReturnValue({
        fire: jest.fn(() => {}),
      });

      act(() => {
        mountBoundary(mockCreateAnalyticsEvent);
      });

      await flushPromises();

      expect(mockCreateAnalyticsEvent).toBeCalledTimes(1);
      expect(mockCreateAnalyticsEvent).toBeCalledWith(
        expect.objectContaining({
          action: 'errored',
          actionSubject: 'configPanel',
          eventType: 'ui',
          attributes: expect.objectContaining({
            browserInfo: expect.any(String),
            extensionKey: 'atlassian.confluence.table-viz',
            fields: '[{"type":"string","name":"example","label":"Username"}]',
            error: 'Error: This should fail',
            errorInfo: {
              componentStack: expect.any(String),
            },
            errorStack: expect.any(String),
          }),
        }),
      );
    });
  });
});
