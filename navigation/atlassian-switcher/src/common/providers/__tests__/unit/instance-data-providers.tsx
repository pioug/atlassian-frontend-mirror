import {
  CollaborationGraphRecentContainersProvider,
  emptyCollaborationGraphRecentContainers,
} from '../../instance-data-providers';

declare var global: any;
import React from 'react';
import { mount } from 'enzyme';

describe('collaboration graph recent containers provider', () => {
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

  it('disables collaboration graph recent containers', async () => {
    const children = jest.fn().mockReturnValue(<div />);
    mount(
      <CollaborationGraphRecentContainersProvider cloudId="cloudid">
        {children}
      </CollaborationGraphRecentContainersProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith(
      emptyCollaborationGraphRecentContainers,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('enables collaboration graph recent containers', async () => {
    const children = jest.fn().mockReturnValue(<div />);
    mount(
      <CollaborationGraphRecentContainersProvider
        cloudId="cloudid"
        enableRecentContainers
      >
        {children}
      </CollaborationGraphRecentContainersProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      data: null,
      status: 'loading',
    });
    expect(fetchMock).toHaveBeenCalled();
  });
});
