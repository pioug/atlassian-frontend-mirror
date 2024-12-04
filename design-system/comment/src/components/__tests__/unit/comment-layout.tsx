import React from 'react';

import { render, screen } from '@testing-library/react';

import Avatar from '@atlaskit/avatar';

import { CommentLayout } from '../../../index';

describe('@atlaskit comments', () => {
	describe('CommentLayout', () => {
		describe('exports', () => {
			it('the CommentLayout component', () => {
				expect(CommentLayout).not.toBe(undefined);
			});
		});

		describe('construction', () => {
			it('should be able to create a component', () => {
				render(<CommentLayout testId="comment-layout" />);

				expect(screen.getByTestId('comment-layout')).toBeInTheDocument();
			});
		});

		describe('props', () => {
			describe('avatar prop', () => {
				const testId = 'testId';

				it('should render the avatar in the correct location', () => {
					const avatar = <Avatar src="test/src" testId={testId} />;
					render(<CommentLayout avatar={avatar} />);

					const avatarImg = screen.getByTestId(`${testId}--image`);

					expect(avatarImg).toBeInTheDocument();
					expect(avatarImg).toHaveAttribute('src', 'test/src');
				});

				it('can render non-Avatar nodes as the comment avatar', () => {
					const avatar = <img src="test/src" alt="test alt" />;
					render(<CommentLayout avatar={avatar} />);

					const customAvatarImg = screen.getByRole('img');

					expect(customAvatarImg).toBeInTheDocument();
					expect(customAvatarImg).toHaveAttribute('src', 'test/src');
					expect(customAvatarImg).toHaveAttribute('alt', 'test alt');
				});
			});

			describe('content prop', () => {
				it('should render the provided content in the correct container', () => {
					const content = <p data-testid="custom-child">My sample content</p>;
					render(<CommentLayout content={content} />);

					expect(screen.getByText('My sample content')).toBeInTheDocument();
					expect(screen.getByTestId('custom-child')).toBeInTheDocument();
				});
			});
		});

		describe('nesting', () => {
			it('should render child comments in the correct container', () => {
				const childComment = <CommentLayout content="child" testId="child" />;
				render(
					<CommentLayout content="parent" testId="parent">
						{childComment}
					</CommentLayout>,
				);

				const child = screen.getByTestId('child');

				expect(child).toBeInTheDocument();
				expect(child).toHaveTextContent('child');
				expect(screen.getByTestId('parent')).toHaveTextContent(/parent/);
			});

			it('should render multiple adjacent siblings', () => {
				const childComments = [
					<CommentLayout key="1" content="child1" />,
					<CommentLayout key="2" content="child2" />,
				];
				render(
					<CommentLayout content="parent" testId="parent">
						{childComments}
					</CommentLayout>,
				);
				expect(screen.getByTestId('parent')).toHaveTextContent(/child1/);
				expect(screen.getByTestId('parent')).toHaveTextContent(/child2/);
			});
		});

		describe('highlighting', () => {
			it('should render highlight container if highlighted prop is true', () => {
				render(
					<CommentLayout testId="comment-layout" highlighted={true}>
						child
					</CommentLayout>,
				);

				expect(screen.getByTestId('comment-layout-highlighted')).toBeInTheDocument();
			});

			it('should not render highlight container if highlighted prop is false', () => {
				render(<CommentLayout testId="comment-layout">child</CommentLayout>);

				expect(screen.queryByTestId('comment-layout-highlighted')).not.toBeInTheDocument();
			});
		});
	});
});
