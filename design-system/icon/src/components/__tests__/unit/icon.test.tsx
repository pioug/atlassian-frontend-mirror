import React, { CSSProperties } from 'react';
import { cleanup, render } from '@testing-library/react';

import Icon, { size, IconProps } from '../../..';
import AddIcon from '../../../../glyph/add';
import { sizes as sizeValues } from '../../../constants';
import { Size } from '../../../types';

describe('@atlaskit/icon', () => {
  afterEach(cleanup);
  describe('Icon', () => {
    const secretContent = 'secret content';
    const secretWrapper = (props: {}) => <svg {...props}>{secretContent}</svg>;
    const empty = (props: {}) => <svg {...props}>Icon</svg>;
    const MyIcon = (props: IconProps) => (
      <Icon glyph={secretWrapper} {...props} />
    );

    it('should match the DOM Snapshot', () => {
      const { getByLabelText } = render(<Icon glyph={empty} label="My icon" />);

      expect(getByLabelText('My icon')).toMatchSnapshot();
    });

    describe('glyph prop', () => {
      it('should render an SVG provided via JSX', () => {
        const id = 'customSvg';
        const customGlyphJsx = (props: {}) => (
          <svg {...props} data-testid={id} />
        );

        const { getByTestId } = render(
          <Icon glyph={customGlyphJsx} label="" />,
        );
        expect(getByTestId(id)).toBeDefined();
      });

      it('should present itself as an image', () => {
        const { getByRole } = render(
          <Icon glyph={empty} testId="empty-icon" label="My icon" />,
        );

        expect(getByRole('img')).toBeDefined();
      });
    });

    describe('dangerouslySetGlyph prop', () => {
      const id = 'customSvg';
      const customGlyphString = `<svg data-testid=${id}></svg>`;

      it('should render an SVG provided as a string', () => {
        const { getByTestId } = render(
          <Icon
            testId="test-icon"
            dangerouslySetGlyph={customGlyphString}
            label="hello-world"
          />,
        );
        const svg = getByTestId(id);
        expect(svg).toBeDefined();
        expect(svg.nodeName).toEqual('svg');
      });

      it('should present itself as an image when label is defined', () => {
        const testId = 'test-icon';
        const { getByTestId } = render(
          <Icon
            testId="test-icon"
            dangerouslySetGlyph={customGlyphString}
            label="hello-world"
          />,
        );

        const element = getByTestId(testId);
        expect(element.getAttribute('role')).toEqual('img');
        expect(element.getAttribute('aria-label')).toEqual('hello-world');
      });

      it('should present itself as presentation when label is an empty string', () => {
        const testId = 'test-icon';
        const { getByTestId } = render(
          <Icon
            testId="test-icon"
            dangerouslySetGlyph={customGlyphString}
            label=""
          />,
        );

        const element = getByTestId(testId);
        expect(element.getAttribute('role')).toEqual('presentation');
        expect(element.getAttribute('aria-label')).toEqual(null);
      });

      it('should be hidden for assistive technologies when label is an empty string', () => {
        const testId = 'test-icon';
        const { getByTestId } = render(
          <Icon
            testId="test-icon"
            dangerouslySetGlyph={customGlyphString}
            label=""
          />,
        );

        const element = getByTestId(testId);
        expect(element.getAttribute('aria-hidden')).toBe('true');
      });
    });

    describe('exports', () => {
      it('exports handled sizes', () => {
        expect(size).not.toBe(undefined);
        expect(
          (Object.keys(size) as (keyof typeof size)[]).map((key) => size[key]),
        ).toEqual(['small', 'medium', 'large', 'xlarge']);
      });
    });

    it('should be possible to create an Icon via a subclass', () => {
      const { getByLabelText } = render(<MyIcon label="My icon" />);

      expect(getByLabelText('My icon')).toBeDefined();
    });

    describe('size property', () => {
      const sizes: Size[] = ['small', 'medium', 'large', 'xlarge'];

      sizes.forEach((s) => {
        it(`with value ${s}`, () => {
          const { getByLabelText } = render(
            <Icon glyph={empty} label={s} size={s} />,
          );
          const element = getByLabelText(s);
          expect(element).toHaveStyleDeclaration('height', sizeValues[s]);
          expect(element).toHaveStyleDeclaration('width', sizeValues[s]);
        });
      });

      it(`should use width/height if provided`, () => {
        const label = 'width';
        const props = { width: 10, height: 10 } as CSSProperties;
        const { getByLabelText } = render(
          <Icon glyph={empty} label={label} {...props} />,
        );
        const element = getByLabelText(label);
        expect(element).toHaveStyleDeclaration('height', '10px');
        expect(element).toHaveStyleDeclaration('width', '10px');
      });

      it(`should use width/height above size`, () => {
        const size = 'large';
        const props = { width: 10, height: 10 } as CSSProperties;
        const { getByLabelText } = render(
          <Icon glyph={empty} label={size} size={size} {...props} />,
        );
        const element = getByLabelText(size);
        expect(element).toHaveStyleDeclaration('height', '10px');
        expect(element).toHaveStyleDeclaration('width', '10px');
      });
    });

    describe('primaryColor property', () => {
      const testLabel = 'test';
      it('is set to inherit the text color by default', () => {
        const { getByLabelText } = render(<MyIcon label={testLabel} />);

        expect(getByLabelText(testLabel).firstChild).toHaveStyle(
          `color: var(--icon-color)`,
        );
      });
    });

    describe('secondaryColor property', () => {
      it('is set to the default theme background color by default', () => {
        const label = 'default secondaryColor';
        const { getByLabelText } = render(<MyIcon label={label} />);

        expect(getByLabelText(label).firstChild).toHaveStyle(
          `fill: var(--icon-secondary-color)`,
        );
      });

      it('can be changed to a hex value', () => {
        const secondaryColor = '#ff0000';
        const label = 'hex secondaryColor';
        const { getByLabelText } = render(
          <MyIcon label={label} secondaryColor={secondaryColor} />,
        );

        expect(getByLabelText(label).firstChild).toHaveStyle(
          `fill: var(--icon-secondary-color)`,
        );
      });

      it('can be changed to a named color', () => {
        const secondaryColor = 'rebeccapurple';
        const label = 'hex secondaryColor';
        const { getByLabelText } = render(
          <MyIcon label={label} secondaryColor={secondaryColor} />,
        );

        const element = getByLabelText(label);

        expect(element.firstChild).toHaveStyle(
          'fill: var(--icon-secondary-color)',
        );
      });
    });
  });
  describe('Glyph', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    const glyph = <AddIcon testId="test" label="test-label" />;

    it('should match snapshot', () => {
      const { getByTestId } = render(glyph);
      expect(getByTestId('test')).toMatchSnapshot();
    });

    it('should have the correct label', () => {
      const { getByLabelText } = render(glyph);
      expect(getByLabelText('test-label')).toBeDefined();
    });
  });
});
