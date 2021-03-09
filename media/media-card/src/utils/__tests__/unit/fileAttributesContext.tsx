import React from 'react';
import { mount } from 'enzyme';
import {
  FileAttributesProvider,
  withFileAttributes,
  WithFileAttributesProps,
} from '../../fileAttributesContext';
import { FileAttributes } from '@atlaskit/media-common';

describe('AnalyticsPayloadDataContext', () => {
  it('should attach payload data as react context and inject it as property through the HOC', () => {
    const checkForData = jest.fn();
    const SomeNesting: React.FC<{}> = ({ children }) => <div>{children}</div>;
    const ContextConsumer = ({ fileAttributes }: WithFileAttributesProps) => {
      checkForData(fileAttributes);
      return <span>Hi!</span>;
    };
    const ConsumerWithPayloadData = withFileAttributes(ContextConsumer);

    const fileAttributes: FileAttributes = {
      fileId: 'some-id',
      fileSize: 10,
      fileMediatype: 'image',
      fileMimetype: 'image/png',
      fileStatus: 'processed',
    };

    mount(
      <FileAttributesProvider data={fileAttributes}>
        <SomeNesting>
          <ConsumerWithPayloadData />
        </SomeNesting>
        ,
      </FileAttributesProvider>,
    );

    expect(checkForData).toBeCalledWith(fileAttributes);
  });
});
