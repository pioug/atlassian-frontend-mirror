import React, { FC, ReactNode } from 'react';

import { fireEvent, render } from '@testing-library/react';

import Avatar, { AvatarItem } from '../../index';

describe('Avatar', () => {
  it('should render a span when neither onClick or href us supplied', () => {
    const { getByTestId } = render(
      <AvatarItem avatar={<Avatar />} testId={'avatar'} />,
    );

    expect(getByTestId('avatar--itemInner').tagName).toEqual('SPAN');
  });

  it('should render a button when onClick us supplied', () => {
    const { getByTestId } = render(
      <AvatarItem
        avatar={<Avatar />}
        testId={'avatar'}
        onClick={event => null}
      />,
    );

    expect(getByTestId('avatar--itemInner').tagName).toEqual('BUTTON');
  });

  it('should render disabled button', () => {
    const { getByTestId } = render(
      <AvatarItem
        avatar={<Avatar />}
        testId={'avatar'}
        isDisabled
        onClick={event => null}
      />,
    );
    const element = getByTestId('avatar--itemInner');

    expect(element.tagName).toEqual('BUTTON');
    expect(element.hasAttribute('disabled')).toBeTruthy();
  });

  it('should render anchor when href us supplied', () => {
    const { getByTestId } = render(
      <AvatarItem
        avatar={<Avatar />}
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
      />,
    );
    expect(getByTestId('avatar--itemInner').tagName).toEqual('A');
  });

  it('should render an anchor with appropriate rel attribute if target blank is supplied', () => {
    const { getByTestId } = render(
      <AvatarItem
        avatar={<Avatar />}
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        target="_blank"
      />,
    );
    const element = getByTestId('avatar--itemInner');

    expect(element.tagName).toEqual('A');
    expect(element.getAttribute('rel')).toEqual('noopener noreferrer');
  });

  it('should render an anchor without rel attribute if target blank is not supplied', () => {
    const { getByTestId } = render(
      <AvatarItem
        avatar={<Avatar />}
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
      />,
    );
    const element = getByTestId('avatar--itemInner');

    expect(element.tagName).toEqual('A');
    expect(element.hasAttribute('rel')).toBeFalsy();
  });

  it('should render a custom component if supplied', () => {
    const MyComponent: FC<{ children: ReactNode; testId?: string }> = ({
      testId,
      children,
    }) => <div data-testid={testId}>{children}</div>;

    const { getByTestId } = render(
      <AvatarItem
        avatar={<Avatar />}
        testId={'avatar'}
        href={'https://atlaskit.atlassian.com/'}
        component={MyComponent}
      />,
    );
    expect(getByTestId('avatar--itemInner').tagName).toEqual('DIV');
  });

  it('should not call onclick if disabled', () => {
    const onClick = jest.fn();

    const { getByTestId } = render(
      <AvatarItem
        avatar={<Avatar />}
        testId={'avatar'}
        onClick={onClick}
        isDisabled
      />,
    );
    const element = getByTestId('avatar--itemInner');

    fireEvent.click(element);

    expect(onClick).not.toHaveBeenCalled();
  });
});
