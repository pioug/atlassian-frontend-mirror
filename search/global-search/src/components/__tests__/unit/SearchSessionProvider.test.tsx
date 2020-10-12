import React from 'react';
import { mount } from 'enzyme';
import SearchSessionProvider, {
  injectSearchSession,
} from '../../SearchSessionProvider';

describe('SearchSessionProvider', () => {
  const DummyComponent = (props: any) => <div />;

  it('generates and passes searchSessionId to children', () => {
    const InjectedDummyComponent = injectSearchSession(DummyComponent);

    const wrapper = mount(
      <SearchSessionProvider>
        <InjectedDummyComponent />
      </SearchSessionProvider>,
    );

    const searchSessionId = wrapper
      .find(DummyComponent)
      .prop('searchSessionId');
    expect(searchSessionId).toBeTruthy();
  });

  it('passes the same searchSessionId to all its children', () => {
    const InjectedDummyComponent = injectSearchSession(DummyComponent);

    const wrapper = mount(
      <SearchSessionProvider>
        <InjectedDummyComponent />
        <InjectedDummyComponent />
        <div>
          <InjectedDummyComponent />
        </div>
      </SearchSessionProvider>,
    );

    const children = wrapper.find(DummyComponent);
    const searchSessionId = children.first().prop('searchSessionId');

    expect(children).toHaveLength(3);
    children.forEach(child => {
      expect(child.prop('searchSessionId')).toEqual(searchSessionId);
    });
  });

  it('injectedSearchSession component works without provider', () => {
    const InjectedDummyComponent = injectSearchSession(DummyComponent);

    const wrapper = mount(<InjectedDummyComponent />);

    const searchSessionId = wrapper
      .find(DummyComponent)
      .prop('searchSessionId');
    expect(searchSessionId).toBeTruthy();
  });

  it('injectedSearchSession component does not change on re-render without a provider', () => {
    const InjectedDummyComponent = injectSearchSession(DummyComponent);

    const wrapper = mount(<InjectedDummyComponent />);

    const searchSessionId = wrapper
      .find(DummyComponent)
      .prop('searchSessionId');

    wrapper.setProps({
      blah: 'blah',
    });

    wrapper.update();

    const searchSessionId2 = wrapper
      .find(DummyComponent)
      .prop('searchSessionId');

    expect(searchSessionId).toEqual(searchSessionId2);
  });

  it('injectedSearchSession component without provider generates different session id for each instance', () => {
    const InjectedDummyComponent = injectSearchSession(DummyComponent);

    const wrapper = mount(
      <>
        <InjectedDummyComponent />
        <InjectedDummyComponent />
      </>,
    );

    const children = wrapper.find(DummyComponent);
    expect(children).toHaveLength(2);

    const searchSessionId = children.first().prop('searchSessionId');
    const otherSearchSessionId = children.last().prop('searchSessionId');

    expect(searchSessionId).not.toEqual(otherSearchSessionId);
  });

  it('different SearchSessionProvider instances provide different session id', () => {
    const InjectedDummyComponent = injectSearchSession(DummyComponent);

    const wrapper = mount(
      <>
        <SearchSessionProvider>
          <InjectedDummyComponent />
        </SearchSessionProvider>
        <SearchSessionProvider>
          <InjectedDummyComponent />
        </SearchSessionProvider>
      </>,
    );

    const children = wrapper.find(DummyComponent);
    expect(children).toHaveLength(2);

    const searchSessionId = children.first().prop('searchSessionId');
    const otherSearchSessionId = children.last().prop('searchSessionId');

    expect(searchSessionId).not.toEqual(otherSearchSessionId);
  });
});
