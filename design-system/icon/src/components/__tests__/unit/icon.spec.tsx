import React from 'react';
import { cleanup, render as r } from '@testing-library/react';

import { background } from '@atlaskit/theme/colors';
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
      const { getByLabelText } = r(<Icon glyph={empty} label="My icon" />);

      expect(getByLabelText('My icon')).toMatchSnapshot();
    });

    describe('glyph prop', () => {
      it('should render an SVG provided via JSX', () => {
        const id = 'customSvg';
        const customGlyphJsx = (props: {}) => (
          <svg {...props} data-testid={id} />
        );

        const { getByTestId } = r(<Icon glyph={customGlyphJsx} label="" />);

        expect(getByTestId(id)).toBeDefined();
      });

      it('should present itself as an image', () => {
        const { getByRole } = r(
          <Icon glyph={empty} testId="empty-icon" label="My icon" />,
        );

        expect(getByRole('img')).toBeDefined();
      });
    });

    describe('dangerouslySetGlyph prop', () => {
      const id = 'customSvg';
      const customGlyphString = `<svg data-testid=${id}></svg>`;

      it('should render an SVG provided as a string', () => {
        const { getByTestId } = r(
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
        const { getByTestId } = r(
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
        const { getByTestId } = r(
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
      const { getByLabelText } = r(<MyIcon label="My icon" />);

      expect(getByLabelText('My icon')).toBeDefined();
    });

    describe('size property', () => {
      const sizes: Size[] = ['small', 'medium', 'large', 'xlarge'];

      sizes.forEach((s) => {
        it(`with value ${s}`, () => {
          const { getByLabelText } = r(
            <Icon glyph={empty} label={s} size={s} />,
          );
          const element = getByLabelText(s);
          expect(element).toHaveStyleDeclaration('height', sizeValues[s]);
          expect(element).toHaveStyleDeclaration('width', sizeValues[s]);
        });
      });

      it(`should use width/height if provided`, () => {
        const label = 'width';
        const props = { width: 10, height: 10 } as any;
        const { getByLabelText } = r(
          <Icon glyph={empty} label={label} {...props} />,
        );
        const element = getByLabelText(label);
        expect(element).toHaveStyleDeclaration('height', '10px');
        expect(element).toHaveStyleDeclaration('width', '10px');
      });

      it(`should use width/height above size`, () => {
        const size = 'large';
        const props = { width: 10, height: 10 } as any;
        const { getByLabelText } = r(
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
        const { getByLabelText } = r(<MyIcon label={testLabel} />);

        expect(getByLabelText(testLabel).firstChild).toHaveStyle(
          `color: currentColor`,
        );
      });

      it('can be changed to a hex value', () => {
        const primaryColor = '#ff0000';
        const { getByLabelText } = r(
          <MyIcon label={testLabel} primaryColor={primaryColor} />,
        );

        expect(getByLabelText(testLabel).firstChild).toHaveStyle(
          `color: ${primaryColor}`,
        );
      });

      it('can be changed to a named color', () => {
        const primaryColor = 'rebeccapurple';
        const { getByLabelText } = r(
          <MyIcon label={testLabel} primaryColor={primaryColor} />,
        );

        expect(getByLabelText(testLabel).firstChild).toHaveStyle(
          `color: ${primaryColor}`,
        );
      });
    });

    describe('secondaryColor property', () => {
      it('is set to the default theme background color by default', () => {
        const label = 'default secondaryColor';
        const { getByLabelText } = r(<MyIcon label={label} />);

        expect(getByLabelText(label).firstChild).toHaveStyle(
          `fill: ${background().toString()}`,
        );
      });

      it('can be changed to a hex value', () => {
        const secondaryColor = '#ff0000';
        const label = 'hex secondaryColor';
        const { getByLabelText } = r(
          <MyIcon label={label} secondaryColor={secondaryColor} />,
        );

        expect(getByLabelText(label).firstChild).toHaveStyle(
          `fill: ${secondaryColor}`,
        );
      });

      it('can be changed to a named color', () => {
        const secondaryColor = 'rebeccapurple';
        const label = 'hex secondaryColor';
        const { getByLabelText } = r(
          <MyIcon label={label} secondaryColor={secondaryColor} />,
        );

        expect(getByLabelText(label).firstChild).toHaveStyle(
          `fill: ${secondaryColor}`,
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
      const { getByTestId } = r(glyph);
      expect(getByTestId('test')).toMatchSnapshot();
    });

    it('should have the correct label', () => {
      const { getByLabelText } = r(glyph);
      expect(getByLabelText('test-label')).toBeDefined();
    });
  });
});
