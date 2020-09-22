import React from 'react';
import FieldMessages from '../../../ui/ConfigPanel/FieldMessages';
import { IntlProvider } from 'react-intl';
import { mount, ReactWrapper } from 'enzyme';

function mountMessage({ description }: { description: string }) {
  return mount(
    <IntlProvider locale="en">
      <FieldMessages description={description} />
    </IntlProvider>,
  );
}

function findByInnerHTML(wrapper: ReactWrapper) {
  return wrapper.find('div[dangerouslySetInnerHTML]');
}

describe('Field Messages', () => {
  it('should support a plaintext description', async () => {
    const description = 'my description';
    const wrapper = mountMessage({ description });

    expect(
      findByInnerHTML(wrapper).prop('dangerouslySetInnerHTML'),
    ).toStrictEqual({ __html: description });
  });

  it('should support bold, italic, strong, em and code tags', async () => {
    const description =
      '<b>my</b> <i>description</i> that has <code>code</code> and <strong>strong</strong> <em>emphasis</em>';
    const wrapper = mountMessage({ description });

    expect(
      findByInnerHTML(wrapper).prop('dangerouslySetInnerHTML'),
    ).toStrictEqual({ __html: description });
  });

  it('should drop unsafe/unspecified tags', async () => {
    const wrapper = mountMessage({
      description: `<div>my</div> <a href='ohoh'>description</i> that has <strong><script src='ohno.js'></script>bad code and <em>emphasis</em></strong> on malformed <uNkoWn>tags`,
    });

    expect(
      findByInnerHTML(wrapper).prop('dangerouslySetInnerHTML'),
    ).toStrictEqual({
      __html: `my description that has <strong>bad code and <em>emphasis</em></strong> on malformed tags`,
    });
  });
});
