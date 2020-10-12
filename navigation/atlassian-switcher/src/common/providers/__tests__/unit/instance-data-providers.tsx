import {
  CollaborationGraphRecentContainersProvider,
  RecentContainersProvider,
  emptyCollaborationGraphRecentContainers,
  nullCollaborationGraphRecentContainers,
  nullRecentContainers,
  emptyRecentContainers,
} from '../../instance-data-providers';

declare var global: any;
import React from 'react';
import { mount } from 'enzyme';

describe('recent containers provider', () => {
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

  it('disables recent containers', async () => {
    const children = jest.fn();
    mount(
      <RecentContainersProvider
        cloudId="cloudid"
        disableRecentContainers={true}
      >
        {children}
      </RecentContainersProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith(emptyRecentContainers);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('enables recent containers', async () => {
    const children = jest.fn().mockReturnValue(<div />);
    mount(
      <RecentContainersProvider
        cloudId="cloudid"
        disableRecentContainers={false}
      >
        {children}
      </RecentContainersProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      data: null,
      status: 'loading',
    });
    expect(fetchMock).toHaveBeenCalled();
  });

  it('returns null when collaboration graph recent containers are enabled', async () => {
    const children = jest.fn().mockReturnValue(<div />);
    mount(
      <RecentContainersProvider
        cloudId="cloudid"
        enableCollaborationGraphRecentContainers={true}
      >
        {children}
      </RecentContainersProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith(nullRecentContainers);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

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
      <CollaborationGraphRecentContainersProvider
        cloudId="cloudid"
        disableRecentContainers={true}
        enableCollaborationGraphRecentContainers={true}
      >
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
        enableCollaborationGraphRecentContainers={true}
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

  it('returns null when collaboration graph is disabled', async () => {
    const children = jest.fn().mockReturnValue(<div />);
    mount(
      <CollaborationGraphRecentContainersProvider
        cloudId="cloudid"
        enableCollaborationGraphRecentContainers={false}
      >
        {children}
      </CollaborationGraphRecentContainersProvider>,
    );

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith(
      nullCollaborationGraphRecentContainers,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
