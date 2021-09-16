import React from 'react';
import { mount } from 'enzyme';
import { MediaInlineCardErroredView } from '../..';
import { IntlProvider } from 'react-intl';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import ErrorIcon from '@atlaskit/icon/glyph/error';

describe('Errored view', () => {
  it('should accept custom icon', () => {
    const element = mount(
      <IntlProvider locale={'en'}>
        <MediaInlineCardErroredView
          message="Error"
          icon={<ErrorIcon label="my-icon" />}
        />
      </IntlProvider>,
    );
    expect(element.find(ErrorIcon)).toHaveLength(1);
  });

  it('should render warning icon by default', () => {
    const element = mount(
      <IntlProvider locale={'en'}>
        <MediaInlineCardErroredView message="Error" />
      </IntlProvider>,
    );
    expect(element.find(WarningIcon)).toHaveLength(1);
  });
});
