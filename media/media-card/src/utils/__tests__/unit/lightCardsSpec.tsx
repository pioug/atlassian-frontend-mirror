import React from 'react';
import { shallow, mount } from 'enzyme';
import FileIcon from '@atlaskit/icon/glyph/file';
import WarningIcon from '@atlaskit/icon/glyph/editor/warning';
import SpinnerIcon from '@atlaskit/spinner';

import { CardLoading } from '../../lightCards/cardLoading';
import { CardError } from '../../lightCards/cardError';
import { getDimensionsWithDefault } from '../../lightCards/getDimensionsWithDefault';
import { ErrorIcon } from '../../../../src/utils/errorIcon';

describe('<CardLoading />', () => {
  it('should render spinner when newCardExperience feature flag in on', () => {
    const fileLoading = shallow(
      <CardLoading featureFlags={{ newCardExperience: true }} />,
    );

    expect(fileLoading.find(SpinnerIcon)).toHaveLength(1);
  });

  it('should render the right icon based on the itemType', () => {
    const fileLoading = shallow(<CardLoading />);

    expect(fileLoading.find(FileIcon)).toHaveLength(1);
  });

  it('should render icon with the right size', () => {
    const defaultLoadingSize = shallow(<CardLoading />);

    expect(defaultLoadingSize.find(FileIcon).props().size).toBe('medium');
  });

  describe('getDimensionsWithDefault()', () => {
    it('should use default ones when no dimensions provided', () => {
      expect(getDimensionsWithDefault()).toEqual({
        width: '100%',
        height: '100%',
      });
    });

    it('should use pixel units for provided dimensions', () => {
      expect(getDimensionsWithDefault({ width: 50, height: 50 })).toEqual({
        width: '50px',
        height: '50px',
      });
    });
  });
});

describe('<CardError />', () => {
  it('should render the right icon based on the itemType', () => {
    const fileError = shallow(<CardError />);

    expect(fileError.find(ErrorIcon)).toHaveLength(1);
  });

  it('should render icon with the right size', () => {
    const defaultErrorSize = mount(<CardError />);
    const mediumErrorSize = mount(<CardError size="large" />);
    expect(defaultErrorSize.find(WarningIcon).props().size).toBe('medium');
    expect(mediumErrorSize.find(WarningIcon).props().size).toBe('large');
  });

  it('ErrorIcon should be small by default', () => {
    const defaultErrorIcon = mount(<ErrorIcon />);
    expect(defaultErrorIcon.find(WarningIcon).props().size).toBe('small');
  });

  describe('getDimensionsWithDefault()', () => {
    it('should use default ones when no dimensions provided', () => {
      expect(getDimensionsWithDefault()).toEqual({
        width: '100%',
        height: '100%',
      });
    });

    it('should use pixel units for provided dimensions', () => {
      expect(getDimensionsWithDefault({ width: 50, height: 50 })).toEqual({
        width: '50px',
        height: '50px',
      });
    });
  });
});
