import { ReactWrapper } from 'enzyme';
import React from 'react';
import RecentSearch from '../../../../ui/HyperlinkAddToolbar/HyperlinkAddToolbar';
import RecentItem from '../../../../../../ui/RecentSearch/RecentItem';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { activityProviderMock } from '../../utils';

const timeout = () => new Promise(resolve => window.setTimeout(resolve, 1));

function pressDownArrowInputField(recentSearch: ReactWrapper<any, any>) {
  recentSearch
    .find('input')
    .first()
    .simulate('keydown', {
      keyCode: 40,
    });
}

function pressReturnInputField(recentSearch: ReactWrapper<any, any>) {
  recentSearch
    .find('input')
    .first()
    .simulate('keydown', {
      keyCode: 13,
    });
}

describe('@atlaskit/editor-core/ui/RecentSearch', () => {
  let wrapper: ReactWrapper;
  let onSubmit: jest.Mock;

  beforeEach(async () => {
    onSubmit = jest.fn();
    wrapper = mountWithIntl(
      <RecentSearch onSubmit={onSubmit} provider={activityProviderMock} />,
    );
    await timeout();
    wrapper.update();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should render a list of recent activity items', () => {
    expect(wrapper.find(RecentItem)).toHaveLength(3);
  });

  it('should filter recent activity items by input text', async () => {
    (wrapper.instance() as any).updateInput('recent item 1');
    await timeout();
    wrapper.update();

    expect(wrapper.find(RecentItem)).toHaveLength(1);
    expect(
      wrapper
        .find(RecentItem)
        .at(0)
        .prop('item'),
    ).toHaveProperty('name', 'recent item 1');
  });

  it('should submit with selected activity item when clicked', () => {
    wrapper
      .find(RecentItem)
      .at(1)
      .simulate('mousedown');

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      'recent2-url.com',
      'recent item 2',
      'typeAhead',
    );
  });

  it('should submit with selected activity item when enter is pressed', async () => {
    (wrapper.instance() as any).updateInput('recent');
    await timeout();
    pressReturnInputField(wrapper);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      'http://recent1-url.com',
      'recent item 1',
      'typeAhead',
    );
  });

  it('should submit with selected activity item when navigated to via keyboard and enter pressed', () => {
    pressDownArrowInputField(wrapper);
    pressDownArrowInputField(wrapper);
    pressReturnInputField(wrapper);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      'http://recent2-url.com',
      'recent item 2',
      'typeAhead',
    );
  });

  it('should not submit when URL is invalid', async () => {
    (wrapper.instance() as any).updateInput('javascript:alert(1)');
    pressReturnInputField(wrapper);
    await timeout();

    expect(onSubmit).toHaveBeenCalledTimes(0);
  });

  it('should submit arbitrary link', async () => {
    (wrapper.instance() as any).updateInput('example.com');
    pressReturnInputField(wrapper);
    await timeout();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      'http://example.com',
      'example.com',
      'manual',
    );
  });
});

describe('@atlaskit/editor-core/ui/RecentSearch with displayUrl', () => {
  const mountComponent = async (displayUrl: string | undefined) => {
    const wrapper = mountWithIntl(
      <RecentSearch
        onSubmit={() => {}}
        provider={activityProviderMock}
        displayUrl={displayUrl}
      />,
    );
    await timeout();
    wrapper.update();
    return wrapper;
  };

  it('should display a valid URL on load', async () => {
    const wrapper = await mountComponent('https://www.atlassian.com');
    expect((wrapper.instance().state as any).text).toEqual(
      'https://www.atlassian.com',
    );
    wrapper.unmount();
  });

  it('should NOT display an invalid URL on load', async () => {
    const wrapper = await mountComponent('javascript:alert(1)');
    expect((wrapper.instance().state as any).text).toEqual('');
    wrapper.unmount();
  });
});

describe('@atlaskit/editor-core/ui/RecentSearch without a provider', () => {
  let wrapper: ReactWrapper;
  let onSubmit: jest.Mock;

  beforeEach(async () => {
    onSubmit = jest.fn();
    wrapper = mountWithIntl(<RecentSearch onSubmit={onSubmit} />);
    await timeout();
    wrapper.update();
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should NOT render a list of recent activity items', () => {
    expect(wrapper.find(RecentItem)).toHaveLength(0);
  });
});
