import React from 'react';
import { render, screen } from '@testing-library/react';
import { ExpandedFrame } from '../../../components/ExpandedFrame';
import { expectElementWithText } from '../../../../../__tests__/__utils__/unit-helpers';

describe('ExpandedFrame', () => {
  it('should not render an icon when isPlaceholder=true', async () => {
    render(
      <ExpandedFrame icon={<span data-testid="icon" />} isPlaceholder={true} />,
    );
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument();
  });

  it('should render an icon when isPlaceholder=false', async () => {
    render(
      <ExpandedFrame
        icon={<span data-testid="icon" />}
        isPlaceholder={false}
      />,
    );
    expect(await screen.findByTestId('icon')).toBeInTheDocument();
  });

  it('should not render text when isPlaceholder=true', async () => {
    render(<ExpandedFrame text="foobar" isPlaceholder={true} />);
    await expectElementWithText('expanded-frame', '');
  });

  it('should render text when isPlaceholder=false', async () => {
    render(<ExpandedFrame text="foobar" isPlaceholder={false} />);
    await expectElementWithText('expanded-frame', 'foobar');
  });

  it('should not allow scrolling when allowScrolling is undefined', async () => {
    render(<ExpandedFrame />);
    expect(await screen.findByTestId('embed-content-wrapper')).toHaveStyle(
      'overflow: hidden',
    );
  });

  it('should not allow scrolling when allowScrolling is false', async () => {
    render(<ExpandedFrame allowScrollBar={false} />);
    expect(await screen.findByTestId('embed-content-wrapper')).toHaveStyle(
      'overflow: hidden',
    );
  });

  it('should allow scrolling when allowScrolling is true', async () => {
    render(<ExpandedFrame allowScrollBar={true} />);
    expect(await screen.findByTestId('embed-content-wrapper')).toHaveStyle(
      'overflow: auto',
    );
  });
});
