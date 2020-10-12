import React from 'react';
import Button from '@atlaskit/button/custom-theme-button';
import SearchError from '../../SearchError';
import { mountWithIntl } from '../../../__tests__/unit/helpers/_intl-enzyme-test-helper';

describe('SearchError', () => {
  it('should retry when clicking the try again button', () => {
    const retryMock = jest.fn();
    const wrapper = mountWithIntl(<SearchError onRetryClick={retryMock} />);
    const onClick: Function = wrapper.find(Button).prop('onClick');
    onClick();
    expect(retryMock).toHaveBeenCalled();
  });
});
