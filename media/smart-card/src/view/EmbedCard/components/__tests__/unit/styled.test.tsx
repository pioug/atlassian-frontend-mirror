import React from 'react';
import { mount } from 'enzyme';
import { matchers } from 'jest-emotion';
import { N30 } from '@atlaskit/theme/colors';
import {
  Wrapper,
  LinkWrapper,
  IconWrapper,
  TextWrapper,
  Content,
} from '../../styled';

expect.extend(matchers);

describe('Wrapper', () => {
  it('should render with min-width when there is a minWidth', () => {
    const element = mount(<Wrapper minWidth={100} />);
    expect(element).toHaveStyleRule('min-width', '100px');
  });

  it('should not render with min-width when there is no minWidth', () => {
    const element = mount(<Wrapper />);
    expect(element).not.toHaveStyleRule('min-width', '');
  });

  it('should render with max-width when there is a maxWidth', () => {
    const element = mount(<Wrapper maxWidth={100} />);
    expect(element).toHaveStyleRule('max-width', '100px');
  });

  it('should not render with max-width when there is no maxWidth', () => {
    const element = mount(<Wrapper />);
    expect(element).not.toHaveStyleRule('max-width', '');
  });

  it('should have hover styles when isInteractive=true', () => {
    const element = mount(<Wrapper isInteractive={true} />);
    expect(element).toMatchSnapshot();
  });

  it('should not have hover styles when isInteractive=false', () => {
    const element = mount(<Wrapper />);
    expect(element).toMatchSnapshot();
  });
});

describe('LinkWrapper', () => {
  it('should render with minWidth when there is a minWidth', () => {
    const element = mount(<LinkWrapper minWidth={100} />);
    expect(element).toHaveStyleRule('min-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = mount(<LinkWrapper />);
    expect(element).not.toHaveStyleRule('min-width', '');
  });

  it('should render with minWidth when there is a minWidth', () => {
    const element = mount(<LinkWrapper maxWidth={100} />);
    expect(element).toHaveStyleRule('max-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = mount(<LinkWrapper />);
    expect(element).not.toHaveStyleRule('max-width', '');
  });

  it('should have hover styles when isInteractive=true', () => {
    const element = mount(<LinkWrapper isInteractive={true} />);
    expect(element).toMatchSnapshot();
  });

  it('should not have hover styles when isInteractive=false', () => {
    const element = mount(<LinkWrapper isInteractive={false} />);
    expect(element).toMatchSnapshot();
  });
});

describe('Content', () => {
  it('should not allow overflow content to be visible (iframe contents should handle scrolling)', () => {
    const element = mount(<Content isInteractive={false} />);
    expect(element).toHaveStyleRule('overflow', 'hidden');
  });

  it('should not allow overflow content to be visible (on hover as well)', () => {
    const element = mount(<Content isInteractive={true} />);
    expect(element).toHaveStyleRule('overflow', 'hidden');
  });
});

describe('IconWrapper', () => {
  it('should look like a placeholder when isPlaceholder=true', () => {
    const element = mount(<IconWrapper isPlaceholder={true} />);
    expect(element).toHaveStyleRule('background-color', N30);
  });

  it('should look like a placeholder when isPlaceholder=false', () => {
    const element = mount(<IconWrapper isPlaceholder={false} />);
    expect(element).not.toHaveStyleRule('background-color', N30);
  });
});

describe('TextWrapper', () => {
  it('should look like a placeholder when isPlaceholder=true', () => {
    const element = mount(<TextWrapper isPlaceholder={true} />);
    expect(element).toHaveStyleRule('background-color', N30);
  });

  it('should look like a placeholder when isPlaceholder=false', () => {
    const element = mount(<TextWrapper isPlaceholder={false} />);
    expect(element).not.toHaveStyleRule('background-color', N30);
  });
});
