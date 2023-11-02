import React, { CSSProperties } from 'react';
import { render, screen } from '@testing-library/react';

import Icon, { size, CustomGlyphProps, IconProps } from '../../..';
import AddIcon from '../../../../glyph/add';
import { sizes as sizeValues } from '../../../constants';
import { Size } from '../../../types';

describe('@atlaskit/icon', () => {
  describe('Icon', () => {
    const secretContent = 'secret content';
    const secretWrapper = ({ role }: CustomGlyphProps) => (
      <svg role={role}>{secretContent}</svg>
    );
    const empty = ({ role }: CustomGlyphProps) => <svg role={role}>Icon</svg>;
    const MyIcon = (props: IconProps) => (
      // This is not ideal but is easier for testing
      // eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
      <Icon glyph={secretWrapper} {...props} />
    );

    it('should match the DOM Snapshot', () => {
      render(<Icon glyph={empty} label="My icon" />);

      expect(screen.getByRole('img')).toMatchSnapshot();
    });

    describe('glyph prop', () => {
      it('should render an SVG provided via JSX', () => {
        const id = 'customSvg';
        const customGlyphJsx = ({ role }: CustomGlyphProps) => (
          <svg role={role} data-testid={id} />
        );

        render(<Icon glyph={customGlyphJsx} label="" />);
        expect(
          screen.getByRole('presentation', { hidden: true }),
        ).toBeInTheDocument();
      });

      it('should present itself as an image', () => {
        render(<Icon glyph={empty} testId="empty-icon" label="My icon" />);

        expect(screen.getByRole('img')).toBeInTheDocument();
      });
    });

    describe('dangerouslySetGlyph prop', () => {
      const id = 'customSvg';
      const customGlyphString = `<svg data-testid="${id}"></svg>`;

      it('should render an SVG provided as a string', () => {
        render(
          <Icon
            testId="test-icon"
            dangerouslySetGlyph={customGlyphString}
            label="hello-world"
          />,
        );
        const svg = screen.getByTestId(id);
        expect(svg).toBeInTheDocument();
        expect(svg.nodeName).toEqual('svg');
      });

      it('should present itself as an image when label is defined', () => {
        render(
          <Icon dangerouslySetGlyph={customGlyphString} label="hello-world" />,
        );

        const element = screen.getByRole('img');
        expect(element).toHaveAttribute('aria-label', 'hello-world');
      });

      it('should present as hidden, without a role when the label is an empty string', () => {
        const testId = 'test-icon';
        render(
          <Icon
            testId={testId}
            dangerouslySetGlyph={customGlyphString}
            label=""
          />,
        );

        const element = screen.getByTestId(testId);
        expect(element).not.toHaveAttribute('role');
        expect(element).not.toHaveAttribute('aria-label');
        expect(element).toHaveAttribute('aria-hidden', 'true');
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
      render(<MyIcon label="My icon" />);

      expect(screen.getByRole('img')).toBeInTheDocument();
    });

    describe('size property', () => {
      const sizes: Size[] = ['small', 'medium', 'large', 'xlarge'];

      sizes.forEach((s) => {
        it(`with value ${s}`, () => {
          render(<Icon glyph={empty} label={s} size={s} />);
          const element = screen.getByRole('img');
          expect(element).toHaveStyleDeclaration('height', sizeValues[s]);
          expect(element).toHaveStyleDeclaration('width', sizeValues[s]);
        });
      });

      it(`should use width/height if provided`, () => {
        const label = 'width';
        const props = { width: 10, height: 10 } as CSSProperties;
        render(<Icon glyph={empty} label={label} {...props} />);
        const element = screen.getByRole('img');
        expect(element).toHaveStyleDeclaration('height', '10px');
        expect(element).toHaveStyleDeclaration('width', '10px');
      });

      it(`should use width/height above size`, () => {
        const size = 'large';
        const props = { width: 10, height: 10 } as CSSProperties;
        render(<Icon glyph={empty} label={size} size={size} {...props} />);
        const element = screen.getByRole('img');
        expect(element).toHaveStyleDeclaration('height', '10px');
        expect(element).toHaveStyleDeclaration('width', '10px');
      });
    });

    describe('primaryColor property', () => {
      const testLabel = 'test';
      it('is set to inherit the text color by default', () => {
        render(<MyIcon label={testLabel} />);

        expect(screen.getByRole('img')).toHaveStyle(`color: var(--icon-color)`);
      });
    });

    describe('secondaryColor property', () => {
      it('is set to the default theme background color by default', () => {
        render(<MyIcon label="default secondaryColor" />);

        expect(screen.getByRole('presentation')).toHaveStyle(
          `fill: var(--icon-secondary-color)`,
        );
      });

      it('can be changed to a hex value', () => {
        const secondaryColor = '#ff0000';
        const label = 'hex secondaryColor';
        render(<MyIcon label={label} secondaryColor={secondaryColor} />);

        expect(screen.getByRole('presentation')).toHaveStyle(
          `fill: var(--icon-secondary-color)`,
        );
      });

      it('can be changed to a named color', () => {
        const secondaryColor = 'rebeccapurple';
        const label = 'hex secondaryColor';
        render(<MyIcon label={label} secondaryColor={secondaryColor} />);

        expect(screen.getByRole('presentation')).toHaveStyle(
          'fill: var(--icon-secondary-color)',
        );
      });
    });
  });
  describe('Glyph', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    const label = 'test-label';
    const glyph = <AddIcon label={label} />;

    it('should match snapshot', () => {
      render(glyph);
      expect(screen.getByRole('img')).toMatchSnapshot();
    });

    it('should have the correct label', () => {
      render(glyph);
      expect(screen.getByRole('img')).toHaveAccessibleName(label);
    });
  });
});
