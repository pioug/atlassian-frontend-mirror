import React from 'react';

import {
  isFlexibleUiBlock,
  isFlexibleUiCard,
  isFlexibleUiElement,
  isFlexibleUiTitleBlock,
} from '../flexible';
import { Title } from '../../view/FlexibleCard/components/elements';
import Block from '../../view/FlexibleCard/components/blocks/block';
import { TitleBlock } from '../../view/FlexibleCard/components/blocks';

describe('isFlexibleUiCard', () => {
  it('returns true if card appearance is inline', () => {
    const isFlexible = isFlexibleUiCard('inline', <TitleBlock />);

    expect(isFlexible).toBeTruthy();
  });

  it('returns true if card appearance is block', () => {
    const isFlexible = isFlexibleUiCard('block', <TitleBlock />);

    expect(isFlexible).toBeTruthy();
  });

  it('returns false if card appearance is neither inline or block', () => {
    const isFlexible = isFlexibleUiCard('embed', <TitleBlock />);

    expect(isFlexible).toBeFalsy();
  });

  it('returns false if card does not have any children', () => {
    const isFlexible = isFlexibleUiCard('embed');

    expect(isFlexible).toBeFalsy();
  });

  it('returns false if card children is not a flexible ui block', () => {
    const isFlexible = isFlexibleUiCard('embed', <div />);

    expect(isFlexible).toBeFalsy();
  });
});

describe('isFlexibleUiBlock', () => {
  it('returns true if React.Node is Flexible UI block', () => {
    const isBlock = isFlexibleUiBlock(<TitleBlock />);

    expect(isBlock).toBeTruthy();
  });

  it('returns false if React.Node is not Flexible UI block', () => {
    const isBlock = isFlexibleUiBlock(<div></div>);

    expect(isBlock).toBeFalsy();
  });

  it('return false if node is invalid', () => {
    const isBlock = isFlexibleUiBlock('This is a text.');

    expect(isBlock).toBeFalsy();
  });
});

describe('isFlexibleUiElement', () => {
  it('returns true if React.Node is Flexible UI element', () => {
    const isElement = isFlexibleUiElement(<Title />);

    expect(isElement).toBeTruthy();
  });

  it('returns false if React.Node is not Flexible UI element', () => {
    const isElement = isFlexibleUiElement(<Block />);

    expect(isElement).toBeFalsy();
  });

  it('return false if node is invalid', () => {
    const isElement = isFlexibleUiElement('This is a text.');

    expect(isElement).toBeFalsy();
  });
});

describe('isFlexibleUiTitleBlock', () => {
  it('returns true if React.Node is Flexible UI Title block', () => {
    const isBlock = isFlexibleUiTitleBlock(<TitleBlock />);

    expect(isBlock).toBeTruthy();
  });

  it('returns false if React.Node is not Flexible UI block', () => {
    const isBlock = isFlexibleUiTitleBlock(<div></div>);

    expect(isBlock).toBeFalsy();
  });

  it('return false if node is invalid', () => {
    const isBlock = isFlexibleUiTitleBlock('This is a text.');

    expect(isBlock).toBeFalsy();
  });
});
