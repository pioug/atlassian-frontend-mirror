import React from 'react';
import { render, screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import {
  inlineExtensionData,
  bodiedExtensionData,
  extensionData,
} from '@atlaskit/editor-test-helpers/mock-extension-data';

import Lozenge, {
  ICON_SIZE,
} from '../../../../../plugins/extension/ui/Extension/Lozenge';

describe('@atlaskit/editor-core/ui/Extension/Lozenge', () => {
  it('should render image if extension has an image param', () => {
    render(<Lozenge node={inlineExtensionData[0] as any} />);
    const lozenge = screen.queryByRole('img');
    expect(lozenge).not.toBeNull();
    expect(lozenge?.className).toContain('-lozenge-image');
  });

  it('should render icon with fallback width and height', () => {
    render(<Lozenge node={inlineExtensionData[2] as any} />);

    const lozenge = screen.queryByRole('img');
    expect(lozenge).not.toBeNull();
    expect(lozenge?.className).toContain('-lozenge-image');
    expect(lozenge).toHaveProperty('height', ICON_SIZE);
    expect(lozenge).toHaveProperty('width', ICON_SIZE);
  });

  it('should generate title from extensionKey if none is provided', () => {
    const { container } = render(
      <Lozenge node={bodiedExtensionData[1] as any} />,
    );

    const extTitleWrapper = container.getElementsByClassName('extension-title');
    const extTitle = extTitleWrapper[0].textContent;
    expect(extTitleWrapper).toHaveLength(1);
    expect(extTitle).toEqual('Expand');
  });

  it('should have title when one is provided via macroMetadata (confluence)', () => {
    const { container } = render(<Lozenge node={extensionData[2] as any} />);

    const extTitleWrapper = container.getElementsByClassName('extension-title');
    const extTitle = extTitleWrapper[0].textContent;
    expect(extTitleWrapper).toHaveLength(1);
    expect(extTitle).toEqual('Table of Contents');
  });

  it('should have title when one is provided via extensionTitle (forge)', () => {
    const { container } = render(<Lozenge node={extensionData[3] as any} />);

    const extTitleWrapper = container.getElementsByClassName('extension-title');
    const extTitle = extTitleWrapper[0].textContent;
    expect(extTitleWrapper).toHaveLength(1);
    expect(extTitle).toEqual('Forged in Fire');
  });

  it("should render PlaceholderFallback if extension doesn't have an image param", () => {
    render(<Lozenge node={inlineExtensionData[1] as any} />);

    const fallback = screen.queryByTestId('lozenge-fallback');
    expect(fallback).not.toBeNull();
  });
});
