import { fakeIntl } from '@atlaskit/media-test-helpers';

import { getButtonGroupOption } from '../link-toolbar-button-group-options';

describe('getButtonGroupOption', () => {
  it('correctly transforms an `OptionConfig` into `ButtonOptionProps`', () => {
    const dispatch = jest.fn();
    const onClick = jest.fn();

    const result = getButtonGroupOption(fakeIntl, dispatch, {
      appearance: 'inline',
      title: 'Button Title',
      onClick,
      testId: 'inline-appearance',
      selected: false,
    });

    result.onClick();

    expect(result).toEqual(
      expect.objectContaining({
        title: 'fakeIntl["Inline"]',
        selected: false,
        testId: 'inline-appearance',
        disabled: false,
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(onClick);
  });

  it('correctly transforms an `OptionConfig` with no appearance into `ButtonOptionProps` for a `url` button', () => {
    const dispatch = jest.fn();
    const onClick = jest.fn();

    const result = getButtonGroupOption(fakeIntl, dispatch, {
      title: 'Button Title',
      onClick,
      testId: 'url-appearance',
      selected: false,
    });

    result.onClick();

    expect(result).toEqual(
      expect.objectContaining({
        title: 'fakeIntl["URL"]',
        selected: false,
        testId: 'url-appearance',
        disabled: false,
      }),
    );
    expect(dispatch).toHaveBeenCalledWith(onClick);
  });
});
