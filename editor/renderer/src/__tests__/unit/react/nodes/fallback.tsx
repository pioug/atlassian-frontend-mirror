import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';

describe('Renderer - React/Nodes/Fallback', () => {
  const MockedUnsupportedInline = () => <div>UnsupportedInline</div>;
  const MockedChildren = () => <div>Rendered Children</div>;
  const url =
    'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

  let node: ReactWrapper;

  afterEach(() => {
    node.unmount();
  });

  it('should render children if no error', () => {
    node = mount(
      <CardErrorBoundary
        url={url}
        unsupportedComponent={MockedUnsupportedInline}
      >
        <MockedChildren />
      </CardErrorBoundary>,
    );
    expect(node.find('a')).toHaveLength(0);
    expect(node.find(MockedChildren)).toHaveLength(1);
  });

  it('should render url if error occurs, when url is present', () => {
    node = mount(
      <CardErrorBoundary
        url={url}
        unsupportedComponent={MockedUnsupportedInline}
      >
        <MockedChildren />
      </CardErrorBoundary>,
    );

    node.setState({ isError: true });

    const link = node.find('a');

    expect(link.prop('href')).toEqual(url);
    expect(node.find(MockedChildren)).toHaveLength(0);
  });

  it('should render unsupportedComponent if error occurs, when url is not present', () => {
    node = mount(
      <CardErrorBoundary unsupportedComponent={MockedUnsupportedInline}>
        <MockedChildren />
      </CardErrorBoundary>,
    );

    node.setState({ isError: true });

    expect(node.find('a')).toHaveLength(0);
    expect(node.find(MockedUnsupportedInline)).toHaveLength(1);
  });

  it('should render url if error occurs and click on anchor should trigger onClick callback, when url is present', () => {
    const mockedOnClick = jest.fn();
    node = mount(
      <CardErrorBoundary
        onClick={mockedOnClick}
        url={url}
        unsupportedComponent={MockedUnsupportedInline}
      >
        <MockedChildren />
      </CardErrorBoundary>,
    );

    node.setState({ isError: true });

    const link = node.find('a');

    link.simulate('click');

    expect(mockedOnClick).toHaveBeenCalledTimes(1);
  });
});
