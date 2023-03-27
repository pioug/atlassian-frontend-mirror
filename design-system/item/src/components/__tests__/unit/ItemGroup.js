import React from 'react';

import { render, screen } from '@testing-library/react';

import Item, { ItemGroup } from '../../..';

describe('@atlaskit/item - ItemGroup', () => {
  describe('props', () => {
    describe('children', () => {
      it('should render provided children', () => {
        render(
          <ItemGroup>
            <Item>Item one</Item>
            <Item>Item two</Item>
          </ItemGroup>,
        );

        expect(screen.getByText('Item one')).toBeInTheDocument();
        expect(screen.getByText('Item two')).toBeInTheDocument();
      });
    });
    describe('title', () => {
      it('should render title if provided', () => {
        render(<ItemGroup title="Title" />);

        expect(screen.getByText('Title')).toBeInTheDocument();
      });

      it('should not render title if omitted', () => {
        render(<ItemGroup />);

        expect(screen.getByRole('group').childElementCount).toBe(0);
      });
    });
    describe('elemAfter', () => {
      it('should not be rendered if title is omitted', () => {
        render(<ItemGroup elemAfter="Element After" />);

        expect(screen.queryByText('Element After')).not.toBeInTheDocument();
      });

      it('should be rendered if title is provided', () => {
        render(<ItemGroup elemAfter="Element After" title="Title" />);

        expect(screen.getByText('Element After')).toBeInTheDocument();
      });

      it('should accept a node value', () => {
        render(
          <ItemGroup
            elemAfter={<span data-testid="element-after" />}
            title="Title"
          />,
        );

        expect(screen.getByTestId('element-after')).toBeInTheDocument();
      });
    });
  });

  describe('accessibility', () => {
    it('root element should have role="group" by default', () => {
      render(<ItemGroup />);

      expect(screen.getByRole('group')).toBeInTheDocument();
    });

    it('root element should apply role prop if supplied', () => {
      render(<ItemGroup role="menu" />);

      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('title should always have aria-hidden="true" because we use aria-label', () => {
      render(<ItemGroup title="Title" />);

      expect(screen.getByTestId('item-group-title')).toHaveAttribute(
        'aria-hidden',
        'true',
      );
    });

    describe('root element aria-label', () => {
      it('label should be used even if title is provided', () => {
        render(<ItemGroup title="Title" label="Label" />);

        expect(screen.getByRole('group')).toHaveAttribute(
          'aria-label',
          'Label',
        );
      });

      it('title should be used when label is not provided', () => {
        render(<ItemGroup title="Title" />);

        expect(screen.getByRole('group')).toHaveAttribute(
          'aria-label',
          'Title',
        );
      });

      it('it should default to empty string if there are no title and no label', () => {
        render(<ItemGroup />);

        expect(screen.getByRole('group')).toHaveAttribute('aria-label', '');
      });

      it('aria-label should still be correct if passing a node', () => {
        render(<ItemGroup title={<span className="nodeClass">Node</span>} />);

        expect(screen.getByRole('group')).toHaveAttribute('aria-label', 'Node');
      });

      it('aria-label should still be correct if passing a Formatted message in a component', () => {
        const projectName = 'Atlaskit';
        render(
          <ItemGroup
            title={
              <div>
                Hello <b>{projectName}</b>
              </div>
            }
          />,
        );

        expect(screen.getByRole('group')).toHaveAttribute(
          'aria-label',
          'Hello Atlaskit',
        );
      });
    });
  });
});
