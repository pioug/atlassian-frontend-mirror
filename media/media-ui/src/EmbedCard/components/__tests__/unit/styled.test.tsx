import React from 'react';
import { shallow } from 'enzyme';
import { N30 } from '@atlaskit/theme/colors';
import {
  Wrapper,
  LinkWrapper,
  IconWrapper,
  TextWrapper,
  Content,
} from '../../styled';

describe('Wrapper', () => {
  it('should render with minWidth when there is a minWidth', () => {
    const element = shallow(<Wrapper minWidth={100} />);
    expect(element).toHaveStyleRule('min-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = shallow(<Wrapper />);
    expect(element).not.toHaveStyleRule('min-width', '');
  });

  it('should render with minWidth when there is a minWidth', () => {
    const element = shallow(<Wrapper maxWidth={100} />);
    expect(element).toHaveStyleRule('max-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = shallow(<Wrapper />);
    expect(element).not.toHaveStyleRule('max-width', '');
  });

  it('should have hover styles when isInteractive=true', () => {
    const element = shallow(<Wrapper isInteractive={true} />);
    expect(element).toMatchSnapshot();
  });

  it('should not have hover styles when isInteractive=false', () => {
    const element = shallow(<Wrapper />);
    expect(element).toMatchSnapshot();
  });
});

describe('LinkWrapper', () => {
  it('should render with minWidth when there is a minWidth', () => {
    const element = shallow(<LinkWrapper minWidth={100} />);
    expect(element).toHaveStyleRule('min-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = shallow(<LinkWrapper />);
    expect(element).not.toHaveStyleRule('min-width', '');
  });

  it('should render with minWidth when there is a minWidth', () => {
    const element = shallow(<LinkWrapper maxWidth={100} />);
    expect(element).toHaveStyleRule('max-width', '100px');
  });

  it('should not render with minWidth when there is no minWidth', () => {
    const element = shallow(<LinkWrapper />);
    expect(element).not.toHaveStyleRule('max-width', '');
  });

  it('should have hover styles when isInteractive=true', () => {
    const element = shallow(<LinkWrapper isInteractive={true} />);
    expect(element).toMatchSnapshot();
  });

  it('should not have hover styles when isInteractive=false', () => {
    const element = shallow(<LinkWrapper isInteractive={false} />);
    expect(element).toMatchSnapshot();
  });
});

describe('Content', () => {
  it('should not allow overflow content to be visible (iframe contents should handle scrolling)', () => {
    const element = shallow(<Content isInteractive={false} />);
    expect(element).toHaveStyleRule('overflow', 'hidden');
  });

  it('should not allow overflow content to be visible (on hover as well)', () => {
    const element = shallow(<Content isInteractive={true} />);
    expect(element).toHaveStyleRule('overflow', 'hidden');
  });
});

describe('IconWrapper', () => {
  it('should look like a placeholder when isPlaceholder=true', () => {
    const element = shallow(<IconWrapper isPlaceholder={true} />);
    expect(element).toHaveStyleRule('background-color', N30);
  });

  it('should look like a placeholder when isPlaceholder=false', () => {
    const element = shallow(<IconWrapper isPlaceholder={false} />);
    expect(element).not.toHaveStyleRule('background-color', N30);
  });
});

describe('TextWrapper', () => {
  it('should look like a placeholder when isPlaceholder=true', () => {
    const element = shallow(<TextWrapper isPlaceholder={true} />);
    expect(element).toHaveStyleRule('background-color', N30);
  });

  it('should look like a placeholder when isPlaceholder=false', () => {
    const element = shallow(<TextWrapper isPlaceholder={false} />);
    expect(element).not.toHaveStyleRule('background-color', N30);
  });
});
