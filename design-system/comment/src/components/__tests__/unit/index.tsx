import React from 'react';

import { render, screen } from '@testing-library/react';

import Avatar from '@atlaskit/avatar';
import __noop from '@atlaskit/ds-lib/noop';

import Comment, {
  CommentAction,
  CommentAuthor,
  CommentEdited,
  CommentTime,
} from '../../../index';

describe('@atlaskit comments', () => {
  describe('Comment', () => {
    describe('exports', () => {
      it('the Comment component', () => {
        expect(Comment).not.toBe(undefined);
      });
    });

    describe('construction', () => {
      it('should be able to create a component', () => {
        render(<Comment testId="comment" avatar="" />);

        expect(screen.getByTestId('comment')).toBeInTheDocument();
      });
    });

    describe('props', () => {
      describe('actions prop', () => {
        it('should render action items in the correct container', () => {
          const actions = [
            <CommentAction />,
            <CommentAction>action content</CommentAction>,
            <CommentAction onClick={__noop}>action content</CommentAction>,
          ];
          render(<Comment avatar="" actions={actions} testId="comment" />);

          const footer = screen.getByTestId('comment-footer');
          // 3 actions and 2 separators between
          expect(footer.childElementCount).toBe(5);
        });
      });

      describe('author prop', () => {
        it('should render the author in the correct container', () => {
          const author = <CommentAuthor>Joshua Nelson</CommentAuthor>;
          render(<Comment avatar="" author={author} testId="comment" />);

          expect(screen.getByText('Joshua Nelson')).toBeInTheDocument();
          expect(screen.getByTestId('comment-header').textContent).toBe(
            'Joshua Nelson',
          );
        });
      });

      describe('avatar prop', () => {
        it('should be reflected to the CommentLayout', () => {
          const avatar = <Avatar src="test/src" />;
          render(<Comment avatar={avatar} />);

          const avatarImg = screen.queryByRole('img');

          expect(avatarImg).toBeInTheDocument();
          expect(avatarImg).toHaveAttribute('src', 'test/src');
        });
      });

      describe('content prop', () => {
        it('should render the provided content in the correct container', () => {
          const content = (
            <p data-testid="comment-content">My sample content</p>
          );
          render(<Comment avatar="" content={content} />);

          expect(screen.getByText('My sample content')).toBeInTheDocument();
          expect(screen.getByTestId('comment-content')).toBeInTheDocument();
        });

        it('can render string content', () => {
          const textContent = 'My sample content';
          render(<Comment avatar="" content={textContent} />);

          expect(screen.getByText('My sample content')).toBeInTheDocument();
        });
      });

      describe('afterContent prop', () => {
        it('should render "after content" when provided', () => {
          const content = <p>My sample content</p>;
          const afterContent = (
            <button type="button">My sample after content</button>
          );
          render(
            <Comment avatar="" content={content} afterContent={afterContent} />,
          );

          expect(screen.queryByRole('button')).toBeInTheDocument();
          expect(screen.getByText('My sample content')).toBeInTheDocument();
        });
      });

      describe('time prop', () => {
        it('should render the time in the correct container', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          render(<Comment avatar="" time={time} testId="comment" />);

          expect(screen.getByText('30 August, 2016')).toBeInTheDocument();
          expect(screen.getByTestId('comment-header').textContent).toBe(
            '30 August, 2016',
          );
        });
      });

      describe('edited prop', () => {
        it('should render edited correctly', () => {
          const edited = <CommentEdited>Edited</CommentEdited>;
          render(<Comment avatar="" edited={edited} testId="comment" />);

          expect(screen.getByText('Edited')).toBeInTheDocument();
          expect(screen.getByTestId('comment-header').textContent).toBe(
            'Edited',
          );
        });
      });

      describe('type prop', () => {
        it('should render a Lozenge with the type in the correct container', () => {
          const type = 'type';
          render(<Comment avatar="" type={type} testId="comment" />);

          expect(screen.getByText('type')).toBeInTheDocument();
          expect(screen.getByTestId('comment-header').textContent).toBe('type');
        });
      });

      describe('restrictedTo prop', () => {
        it('should render a Lock icon and restrictedTo text when supplied', () => {
          const { container } = render(
            <Comment
              avatar=""
              restrictedTo="atlassian-staff"
              testId="comment"
            />,
          );

          const svg = container.querySelectorAll('svg');

          expect(svg).toHaveLength(1);
          expect(screen.getByTestId('comment').textContent).toContain(
            'atlassian-staff',
          );
        });

        it('should not render a Lock icon if restrictedTo prop is not set', () => {
          const { container } = render(<Comment avatar="" />);

          expect(container.querySelector('svg')).not.toBeInTheDocument();
        });
      });

      describe('isSaving and savingText props', () => {
        describe('if isSaving prop is set', () => {
          it('should render the default savingText if no savingText is set', () => {
            render(<Comment avatar="" isSaving testId="comment" />);

            expect(screen.getByTestId('comment-header').textContent).toContain(
              'Sending...',
            );
          });

          it('should render the savingText text if it is set', () => {
            render(
              <Comment
                avatar=""
                isSaving
                savingText="Saving..."
                testId="comment"
              />,
            );

            expect(screen.getByTestId('comment-header').textContent).toContain(
              'Saving...',
            );
          });

          it('should not render CommentActions', () => {
            const actions = [
              <CommentAction />,
              <CommentAction>action content</CommentAction>,
              <CommentAction onClick={__noop}>action content</CommentAction>,
            ];
            render(
              <Comment
                avatar=""
                actions={actions}
                isSaving
                savingText="Saving..."
                isError
                errorActions={actions}
                testId="comment"
              />,
            );

            expect(
              screen.queryByTestId('comment-footer'),
            ).not.toBeInTheDocument();
          });
        });

        describe('if isSaving prop is not set', () => {
          it('should not render savingText', () => {
            render(
              <Comment avatar="" savingText="Saving..." testId="comment" />,
            );

            expect(screen.getByTestId('comment').textContent).not.toContain(
              'Saving...',
            );
          });
        });
      });

      describe('isError, errorActions and errorLabel props', () => {
        const errorActions = [
          <CommentAction>Retry</CommentAction>,
          <CommentAction onClick={__noop}>Cancel</CommentAction>,
        ];

        describe('if isError prop is set', () => {
          it('should render the default (empty) if no errorIconLabel is set', () => {
            const { container } = render(
              <Comment
                avatar=""
                isError
                errorActions={errorActions}
                testId="comment"
              />,
            );

            const errorIconWithLabel = screen.queryByRole('img');

            expect(errorIconWithLabel).not.toBeInTheDocument();
            expect(container.querySelectorAll('svg')).toHaveLength(1);
          });

          it('should render the errorIconLabel text if it is set', async () => {
            const label = 'Error';
            render(
              <Comment
                avatar=""
                isError
                errorActions={errorActions}
                errorIconLabel={label}
              />,
            );

            const errorIconWithLabel = await screen.findByRole('img');

            expect(errorIconWithLabel).toHaveAttribute('aria-label', label);
          });

          it('should render the icon and errorActions instead of the actions', async () => {
            const actions = [
              <CommentAction />,
              <CommentAction>action content</CommentAction>,
              <CommentAction onClick={__noop}>action content</CommentAction>,
            ];
            const { container } = render(
              <Comment
                avatar=""
                actions={actions}
                isError
                errorActions={errorActions}
                testId="comment"
              />,
            );

            const buttons = await screen.findAllByRole('button');

            expect(container.querySelectorAll('svg')).toHaveLength(1);
            expect(buttons[0]).toHaveTextContent('Retry');
            expect(buttons[1]).toHaveTextContent('Cancel');
          });
        });

        describe('if isError prop is not set', () => {
          it('should not render the icon and errorActions', () => {
            const { container } = render(
              <Comment avatar="" errorActions={errorActions} />,
            );

            expect(container.querySelector('svg')).not.toBeInTheDocument();
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
          });
        });
      });

      describe('headingLevel prop', () => {
        it('should add aria heading role and level', () => {
          render(
            <Comment
              avatar=""
              headingLevel="3"
              type="hello"
              author="DDC"
              testId="comment"
            />,
          );

          const heading = screen.getByRole('heading');

          expect(heading).toBeInTheDocument();
          expect(heading).toHaveAttribute('aria-level', '3');
        });
      });

      describe('Top items', () => {
        it('Should render in the order author, type, time, restrictedTo', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          render(
            <Comment
              author="Mary"
              avatar=""
              type="Type"
              time={time}
              restrictedTo="atlassian-staff"
              testId="comment"
            />,
          );

          const header = screen.getByTestId('comment-header');

          expect(header.textContent).toContain('Mary');
          expect(header.textContent).toContain('atlassian-staff');
          expect(header.textContent).toContain('Type');
          expect(header.textContent).toContain('30 August, 2016');
        });

        it('Should render in the order author, type, savingText, restrictedTo', () => {
          render(
            <Comment
              author="Mary"
              avatar=""
              type="Type"
              restrictedTo="atlassian-staff"
              isSaving
              savingText="Saving..."
              testId="comment"
            />,
          );

          const header = screen.getByTestId('comment');

          expect(header.textContent).toContain('Mary');
          expect(header.textContent).toContain('atlassian-staff');
          expect(header.textContent).toContain('Type');
          expect(header.textContent).toContain('Saving...');
        });

        it('should not render time if isSaving is set', () => {
          const time = <CommentTime>30 August, 2016</CommentTime>;
          render(
            <Comment
              avatar=""
              author="Mary"
              type="Type"
              time={time}
              restrictedTo="atlassian-staff"
              isSaving
              savingText="Saving..."
              testId="comment"
            />,
          );

          const header = screen.getByTestId('comment');

          expect(header.textContent).toContain('Saving...');
          expect(header.textContent).not.toContain('30 August, 2016');
        });
      });
    });

    describe('nesting', () => {
      it('should reflect children to the CommentLayout', () => {
        const childComment = (
          <Comment avatar="" content="child" testId="child" />
        );
        render(
          <Comment avatar="" content="parent" testId="parent">
            {childComment}
          </Comment>,
        );

        const child = screen.getByTestId('child');

        expect(child).toBeInTheDocument();
        expect(child).toHaveTextContent('child');
        expect(screen.getByTestId('parent').textContent).toContain('parent');
      });
    });
  });
});
