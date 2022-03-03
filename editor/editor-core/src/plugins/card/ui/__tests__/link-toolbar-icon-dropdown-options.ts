import { fakeIntl } from '@atlaskit/media-test-helpers';

import { getIconDropdownOption } from '../link-toolbar-icon-dropdown-options';

describe('getIconDropdownOption', () => {
  it('correctly transforms an `OptionConfig` into `IconDropdownOptionProps`', () => {
    const dispatch = jest.fn();
    const onClick = jest.fn();

    const result = getIconDropdownOption(fakeIntl, dispatch, {
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

  it('correctly transforms an `OptionConfig` with no appearance into `IconDropdownOptionProps` for the `url` item', () => {
    const dispatch = jest.fn();
    const onClick = jest.fn();

    const result = getIconDropdownOption(fakeIntl, dispatch, {
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
