declare var global: any;
import React from 'react';
import { mount } from 'enzyme';
import { CustomLinksProvider } from '../confluence-data-providers';

describe('confluence-data-providers', () => {
  let fetchMock: any;
  beforeEach(() => {
    fetchMock = jest.fn();
    fetchMock.mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      });
    });
    global.fetch = fetchMock;
  });

  afterEach(() => {
    fetchMock.mockReset();
  });

  it('disables custom links', async () => {
    const children = jest.fn();
    mount(
      <CustomLinksProvider disableCustomLinks={true}>
        {children}
      </CustomLinksProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      data: [],
      status: 'complete',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('enables custom links', async () => {
    const children = jest.fn().mockReturnValue(<div />);
    mount(
      <CustomLinksProvider disableCustomLinks={false}>
        {children}
      </CustomLinksProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      data: null,
      status: 'loading',
    });
    expect(fetchMock).toHaveBeenCalled();
  });
});
