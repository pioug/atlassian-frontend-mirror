import React from 'react';
import FieldMessages from '../../../ui/ConfigPanel/FieldMessages';
import { IntlProvider } from 'react-intl';
import { mount } from 'enzyme';

function mountMessage({ description }: { description: string }) {
  return mount(
    <IntlProvider locale="en">
      <FieldMessages description={description} />
    </IntlProvider>,
  );
}

function findHTML(wrapper: any) {
  const div = wrapper.find('Description div');
  const children = div.children();
  if (children.length) {
    return children;
  }
  return div.text();
}

describe('Field Messages', () => {
  it(' should support a plaintext description', async () => {
    const description = 'my description';
    const wrapper = mountMessage({ description });

    expect(findHTML(wrapper)).toMatchSnapshot();
  });

  it(' should support bold, italic, strong, em and code tags', async () => {
    const description =
      '<b>my</b> <i>description</i> that has <code>code</code> and <strong>strong</strong> <em>emphasis</em>';
    const wrapper = mountMessage({ description });

    expect(findHTML(wrapper)).toMatchSnapshot();
  });

  it(' should drop unsafe/unspecified tags', async () => {
    const wrapper = mountMessage({
      description: `<div>my</div> <a href='ohoh'>description</i> that has <strong><script src='ohno.js'></script>bad code and <em>emphasis</em></strong> on malformed <uNkoWn>tags`,
    });

    expect(findHTML(wrapper)).toMatchSnapshot();
  });
});
