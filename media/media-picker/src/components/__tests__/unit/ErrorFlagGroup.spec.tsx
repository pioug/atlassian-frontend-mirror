import React from 'react';
import { mount } from 'enzyme';
import ErrorFlagGroup from '../../errorFlagGroup/ErrorFlagGroup';
import { FileEmptyData, UploadRejectionData } from '../../../types';
import { AutoDismissFlag, FlagGroup } from '@atlaskit/flag';

describe('UploadRejectionFlagGroup', () => {
  const rejectionData1: UploadRejectionData = {
    reason: 'fileSizeLimitExceeded',
    fileName: 'file-name-1.png',
    limit: 10_000,
  };
  const rejectionData2: UploadRejectionData = {
    reason: 'fileSizeLimitExceeded',
    fileName: 'file-name-2.png',
    limit: 10_000,
  };

  it('should render a flag when flagData is provided', () => {
    const rejectionFlagGroup = mount(
      <ErrorFlagGroup flagData={[rejectionData1]} onFlagDismissed={() => {}} />,
    );
    const flagGroup = rejectionFlagGroup.find(FlagGroup);
    expect(flagGroup.find(AutoDismissFlag)).toHaveLength(1);
  });

  it('should not render any flags when no payloads are provided', () => {
    const rejectionFlagGroup = mount(
      <ErrorFlagGroup flagData={[]} onFlagDismissed={() => {}} />,
    );
    const flagGroup = rejectionFlagGroup.find(FlagGroup);
    expect(flagGroup.find(AutoDismissFlag)).toHaveLength(0);
  });

  it('should render multiple flags multiple payloads are provided', () => {
    const rejectionFlagGroup = mount(
      <ErrorFlagGroup
        flagData={[rejectionData1, rejectionData2]}
        onFlagDismissed={() => {}}
      />,
    );
    const flagGroup = rejectionFlagGroup.find(FlagGroup);
    expect(flagGroup.find(AutoDismissFlag)).toHaveLength(2);
  });

  it('should render a flag with a descriptive title', () => {
    const rejectionFlagGroup = mount(
      <ErrorFlagGroup flagData={[rejectionData1]} onFlagDismissed={() => {}} />,
    );
    const flag = rejectionFlagGroup.find(AutoDismissFlag);
    expect(flag.prop('title')).toEqual('Your file failed to upload');
  });

  describe('should render a flag with an appropriate description', () => {
    it('with the correct the file name', () => {
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData1, rejectionData2]}
          onFlagDismissed={() => {}}
        />,
      );
      const flags = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flags.get(0).props.description).toEqual(
        'file-name-1.png is too big to upload. Files must be less than 10.00 kB.',
      );
      expect(flags.get(1).props.description).toEqual(
        'file-name-2.png is too big to upload. Files must be less than 10.00 kB.',
      );
    });

    it('with a file size of zero bytes', () => {
      const fileEmptyData: FileEmptyData = {
        reason: 'fileEmpty',
        fileName: 'file-name.png',
      };
      const errorFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[fileEmptyData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = errorFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'The file you selected was empty. Please select another file and try again.',
      );
    });

    it('with a file size limit that is smaller than 1 kB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 1,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 0.001 kB.',
      );
    });

    it('with a file size limit that is just smaller than 1 kB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 999,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 0.999 kB.',
      );
    });

    it('with a file size limit that is 1 kB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 1_000,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 1.00 kB.',
      );
    });

    it('with a file size limit that is between 1kB and 1 MB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 900_000,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 900.00 kB.',
      );
    });

    it('with a file size limit that is just less than 1 MB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 999_999,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 999.999 kB.',
      );
    });

    it('with a file size limit that is 1 MB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 1_000_000,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 1.00 MB.',
      );
    });

    it('with a file size limit that is between 1 MB and 1 GB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 2_000_000,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 2.00 MB.',
      );
    });

    it('with a file size limit that is 1 GB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 1_000_000_000,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 1.00 GB.',
      );
    });

    it('with a file size limit that is just greater than 1 GB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 1_000_000_001,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 1.00 GB.',
      );
    });

    it('with a file size limit that is greater than 1 GB', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 44_000_000_000,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 44.00 GB.',
      );
    });

    it('with a file size limit that is has less than 3 decimal places', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 1_230,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 1.23 kB.',
      );
    });

    it('with a file size limit that should ignore more than 3 decimal places', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 1_201_345,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 1.201 MB.',
      );
    });

    it('with a file size limit that requires commas', () => {
      const rejectionData: UploadRejectionData = {
        reason: 'fileSizeLimitExceeded',
        fileName: 'file-name.png',
        limit: 1_000_000_000_000_000,
      };
      const rejectionFlagGroup = mount(
        <ErrorFlagGroup
          flagData={[rejectionData]}
          onFlagDismissed={() => {}}
        />,
      );
      const flag = rejectionFlagGroup.find(AutoDismissFlag);
      expect(flag.get(0).props.description).toEqual(
        'file-name.png is too big to upload. Files must be less than 1,000,000.00 GB.',
      );
    });
  });

  it('should set onDismissed callback correctly for the FlagGroup', () => {
    const onDismissedCallback = jest.fn();
    const rejectionFlagGroup = mount(
      <ErrorFlagGroup
        flagData={[rejectionData1]}
        onFlagDismissed={onDismissedCallback}
      />,
    );
    const flagGroup = rejectionFlagGroup.find(FlagGroup);
    expect(flagGroup.prop('onDismissed')).toBe(onDismissedCallback);
  });
});
