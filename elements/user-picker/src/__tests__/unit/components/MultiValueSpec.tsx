import { shallow } from 'enzyme';
import React from 'react';
import { AddOptionAvatar } from '../../../components/AddOptionAvatar';
import { MultiValue, scrollToValue } from '../../../components/MultiValue';
import { Email, EmailType, User } from '../../../types';

const mockHtmlElement = (rect: Partial<DOMRect>): HTMLDivElement =>
  ({
    getBoundingClientRect: jest.fn(() => rect),
    scrollIntoView: jest.fn(),
  } as any);

describe('MultiValue', () => {
  const data = {
    label: 'Jace Beleren',
    data: {
      id: 'abc-123',
      name: 'Jace Beleren',
      publicName: 'jbeleren',
      avatarUrl: 'http://avatars.atlassian.com/jace.png',
    } as User,
  };
  const onClick = jest.fn();

  const shallowMultiValue = (
    { components, ...props }: any = { components: {} },
  ) =>
    shallow(
      <MultiValue
        data={data}
        removeProps={{ onClick }}
        selectProps={{ isDisabled: false }}
        {...props}
      />,
    );

  afterEach(() => {
    onClick.mockClear();
  });

  it('should scroll to open from bottom', () => {
    const current = mockHtmlElement({ top: 10, height: 20 });
    const parent = mockHtmlElement({ height: 100 });
    scrollToValue(current, parent);
    expect(current.scrollIntoView).toHaveBeenCalled();
    expect(current.scrollIntoView).toHaveBeenCalledWith();
  });

  it('should scroll to open from top', () => {
    const current = mockHtmlElement({ top: 90, height: 20 });
    const parent = mockHtmlElement({ height: 100 });
    scrollToValue(current, parent);
    expect(current.scrollIntoView).toHaveBeenCalled();
    expect(current.scrollIntoView).toHaveBeenCalledWith(false);
  });

  describe('shouldComponentUpdate', () => {
    const defaultProps = {
      data: data,
      isFocused: false,
      innerProps: {},
    };
    test.each([
      [false, defaultProps],
      [
        true,
        {
          ...defaultProps,
          isFocused: true,
        },
      ],
      [
        true,
        {
          ...defaultProps,
          data: {
            ...data,
            data: {
              ...data.data,
              publicName: 'crazy_jace',
            },
          },
        },
      ],
      [
        true,
        {
          ...defaultProps,
          data: {
            ...data,
            label: 'crazy_jace',
          },
        },
      ],
      [
        true,
        {
          ...defaultProps,
          innerProps: {},
        },
      ],
    ])('should return %s for nextProps %p', (shouldUpdate, nextProps) => {
      const component = shallowMultiValue(defaultProps);
      const instance = component.instance();
      expect(
        instance &&
          instance.shouldComponentUpdate &&
          instance.shouldComponentUpdate(nextProps, {}, {}),
      ).toEqual(shouldUpdate);
    });
  });

  describe('Email', () => {
    const email: Email = {
      type: EmailType,
      id: 'test@test.com',
      name: 'test@test.com',
    };

    it('should render AddOptionAvatar for email data', () => {
      const component = shallowMultiValue({
        data: { data: email, label: email.name },
        innerProps: {},
        selectProps: {
          emailLabel: 'invite',
        },
      });

      expect(component.props().children[0]).toMatchObject(
        <AddOptionAvatar label="invite" isLozenge />,
      );

      expect(component.props().data.data).toMatchObject({
        id: 'test@test.com',
        name: 'test@test.com',
        type: 'email',
      });
    });
  });
});
