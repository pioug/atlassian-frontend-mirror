import React from 'react';
import { mount, ReactWrapper } from 'enzyme';
import { CardErrorBoundary } from '../../../../react/nodes/fallback';
import { isSafeUrl } from '@atlaskit/adf-schema';

const MockedUnsupportedInline = () => <div>UnsupportedInline</div>;
const MockedChildren = () => <div>Rendered Children</div>;
const url =
  'https://extranet.atlassian.com/pages/viewpage.action?pageId=3088533424';

jest.mock('@atlaskit/link-datasource', () => {
  const originalModule = jest.requireActual('@atlaskit/link-datasource');

  return {
    ...originalModule,
    LazyLoadedDatasourceRenderFailedAnalyticsWrapper: ({ children }: never) => (
      <>{children}</>
    ),
  };
});

describe('Renderer - React/Nodes/Fallback', () => {
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

  it('should render url if error occurs when datasource is not present and url is present', () => {
    node = mount(
      <CardErrorBoundary
        url={url}
        unsupportedComponent={MockedUnsupportedInline}
        isDatasource={false}
      >
        <MockedChildren />
      </CardErrorBoundary>,
    );

    node.setState({ isError: true });
    node.update();

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

  it('should render InlineCard if error occurs, when url is present and isDatasource is true and isSafeUrl is true', () => {
    node = mount(
      <CardErrorBoundary
        url={url}
        unsupportedComponent={MockedUnsupportedInline}
        isDatasource={true}
      >
        <MockedChildren />
      </CardErrorBoundary>,
    );

    expect(isSafeUrl(url)).toBe(true);

    node.setState({ isError: true });
    node.update();

    // InlineCard is a LoadableComponent, checking for actual InlineCard would need to mock the provider
    expect(node.find('LoadableComponent').exists()).toBe(true);

    expect(node.find('LoadableComponent').prop('url')).toEqual(url);
  });

  it('should render blue link if error occurs, when url is present and isDatasource is true and isSafeUrl is false', async () => {
    const unsafeUrl = 'javascript:alert(1)';
    node = mount(
      <CardErrorBoundary
        url={unsafeUrl}
        unsupportedComponent={MockedUnsupportedInline}
        isDatasource={true}
      >
        <MockedChildren />
      </CardErrorBoundary>,
    );

    expect(isSafeUrl(unsafeUrl)).toBe(false);

    node.setState({ isError: true });
    node.update();

    const link = node.find('a');

    expect(link.prop('href')).toEqual(unsafeUrl);
    expect(node.find(MockedChildren)).toHaveLength(0);
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
