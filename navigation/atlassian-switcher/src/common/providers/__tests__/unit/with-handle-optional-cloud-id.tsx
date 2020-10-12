import React from 'react';
import { mount } from 'enzyme';
import withHandleOptionalCloudId from '../../with-handle-optional-cloud-id';
import { DataProviderProps, Status } from '../../as-data-provider';

describe('with-handle-optional-cloud-id', () => {
  const DummyProvider = withHandleOptionalCloudId(
    (props: DataProviderProps<string>) => (
      <div>
        {props.children({
          status: Status.COMPLETE,
          data: 'receive-cloud-id',
        })}
      </div>
    ),
    'did-not-receive-cloud-id',
  );

  it('with valid cloud id', async () => {
    const children = jest.fn();
    mount(<DummyProvider cloudId="Has Cloud ID">{children}</DummyProvider>);

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      data: 'receive-cloud-id',
      status: 'complete',
    });
  });

  it('without valid cloud id', async () => {
    const children = jest.fn();
    mount(<DummyProvider>{children}</DummyProvider>);

    expect(children).toHaveBeenCalledTimes(1);
    expect(children).toHaveBeenCalledWith({
      data: 'did-not-receive-cloud-id',
      status: 'complete',
    });
  });
});
