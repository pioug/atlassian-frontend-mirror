import React from 'react';

import userEvent from '@testing-library/user-event';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import Avatar from '@atlaskit/avatar';
import { Anchor } from '@atlaskit/primitives/compiled';
import { render, screen } from '@atlassian/testing-library';

import TagNew from '../../../tag-new';
import AvatarTag from '../../../tag-new/avatar-tag';

// eslint-disable-next-line @atlassian/a11y/require-jest-coverage
describe('TagNew and AvatarTag onClick analytics', () => {
	describe('TagNew onClick analytics', () => {
		const testId = 'tag-new';

		it('should call onClick with analytics event on link tag click', async () => {
			const onClickHandler = jest.fn();

			render(
				<TagNew
					text="Link Tag"
					href="https://example.com"
					onClick={onClickHandler}
					isRemovable={false}
					testId={testId}
				/>,
			);

			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);

			expect(onClickHandler).toHaveBeenCalledTimes(1);
			const [event, analyticsEvent] = onClickHandler.mock.calls[0];
			expect(event.type).toBe('click');
			expect(analyticsEvent).toBeInstanceOf(UIAnalyticsEvent);
		});

		it('should not call onClick when remove button is clicked', async () => {
			const onClickHandler = jest.fn();
			const onRemove = jest.fn(() => true);

			render(
				<TagNew
					text="Removable Link"
					href="https://example.com"
					onClick={onClickHandler}
					isRemovable={true}
					onBeforeRemoveAction={onRemove}
					testId={testId}
				/>,
			);

			const removeButton = screen.getByTestId(`close-button-${testId}`);
			await userEvent.click(removeButton);

			expect(onRemove).toHaveBeenCalledTimes(1);
			expect(onClickHandler).not.toHaveBeenCalled();
		});

		it('should not call onClick for non-link tags', async () => {
			const onClickHandler = jest.fn();

			render(
				<TagNew text="Non-link Tag" onClick={onClickHandler} isRemovable={false} testId={testId} />,
			);

			const tag = screen.getByTestId(testId);
			await userEvent.click(tag);

			expect(onClickHandler).not.toHaveBeenCalled();
		});

		it('should work without onClick prop (backward compatibility)', async () => {
			render(
				<TagNew text="Link Tag" href="https://example.com" isRemovable={false} testId={testId} />,
			);

			const link = screen.getByTestId(`${testId}--link`);
			expect(link).toHaveAttribute('href', 'https://example.com');

			await userEvent.click(link);
		});

		it('should handle multiple clicks', async () => {
			const onClickHandler = jest.fn();

			render(
				<TagNew
					text="Multi-click Tag"
					href="https://example.com"
					onClick={onClickHandler}
					isRemovable={false}
					testId={testId}
				/>,
			);

			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);
			await userEvent.click(link);
			await userEvent.click(link);

			expect(onClickHandler).toHaveBeenCalledTimes(3);
		});

		it('should fire analytics event when onClick is triggered with AnalyticsListener', async () => {
			const onEvent = jest.fn();

			function WithAnalyticsListener() {
				return (
					<AnalyticsListener onEvent={onEvent}>
						<TagNew
							text="Link Tag"
							href="https://example.com"
							onClick={(_event: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => {
								analyticsEvent.fire();
							}}
							isRemovable={false}
							testId={testId}
						/>
					</AnalyticsListener>
				);
			}

			render(<WithAnalyticsListener />);
			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);

			expect(onEvent).toHaveBeenCalledTimes(1);
			expect(onEvent.mock.calls[0][0]).toBeInstanceOf(UIAnalyticsEvent);
		});

		it('should not error if there is no analytics provider', async () => {
			const error = jest.spyOn(console, 'error');
			const onClickHandler = jest.fn();

			render(
				<TagNew
					text="Link Tag"
					href="https://example.com"
					onClick={onClickHandler}
					isRemovable={false}
					testId={testId}
				/>,
			);

			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);

			// Exclude jsdom navigation errors — they are a test-environment artifact caused by
			// clicking a full URL anchor, and are unrelated to analytics provider errors.
			const nonNavigationErrors = error.mock.calls.filter(
				([err]) => !err?.message?.includes('Not implemented: navigation'),
			);
			expect(nonNavigationErrors).toHaveLength(0);
			expect(onClickHandler).toHaveBeenCalledTimes(1);
			error.mockRestore();
		});

		it('should work with custom linkComponent', async () => {
			const onClickHandler = jest.fn();
			const CustomLink = ({ href, onClick, children }: any) => (
				<Anchor href={href} onClick={onClick} testId="custom-link">
					{children}
				</Anchor>
			);

			render(
				<TagNew
					text="Custom Link"
					href="https://example.com"
					onClick={onClickHandler}
					linkComponent={CustomLink}
					isRemovable={false}
					testId={testId}
				/>,
			);

			const link = screen.getByTestId('custom-link');
			await userEvent.click(link);

			expect(onClickHandler).toHaveBeenCalledTimes(1);
		});
	});

	describe('AvatarTag onClick analytics', () => {
		const testId = 'avatar-tag';

		it('should call onClick with analytics event on avatar link tag click', async () => {
			const onClickHandler = jest.fn();

			render(
				<AvatarTag
					text="Avatar Link"
					href="https://example.com"
					onClick={onClickHandler}
					isRemovable={false}
					testId={testId}
					type="user"
					avatar={Avatar}
				/>,
			);

			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);

			expect(onClickHandler).toHaveBeenCalledTimes(1);
			const [event, analyticsEvent] = onClickHandler.mock.calls[0];
			expect(event.type).toBe('click');
			expect(analyticsEvent).toBeInstanceOf(UIAnalyticsEvent);
		});

		it('should not call onClick when avatar remove button is clicked', async () => {
			const onClickHandler = jest.fn();
			const onRemove = jest.fn(() => true);

			render(
				<AvatarTag
					text="Removable Avatar"
					href="https://example.com"
					onClick={onClickHandler}
					isRemovable={true}
					onBeforeRemoveAction={onRemove}
					testId={testId}
					type="user"
					avatar={Avatar}
				/>,
			);

			const removeButton = screen.getByTestId(`close-button-${testId}`);
			await userEvent.click(removeButton);

			expect(onRemove).toHaveBeenCalledTimes(1);
			expect(onClickHandler).not.toHaveBeenCalled();
		});

		it('should not call onClick for non-link avatar tags', async () => {
			const onClickHandler = jest.fn();

			render(
				<AvatarTag
					text="Non-link Avatar"
					onClick={onClickHandler}
					isRemovable={false}
					testId={testId}
					type="user"
					avatar={Avatar}
				/>,
			);

			const tag = screen.getByTestId(testId);
			await userEvent.click(tag);

			expect(onClickHandler).not.toHaveBeenCalled();
		});

		it('should work without onClick prop on avatar tags', async () => {
			render(
				<AvatarTag
					text="Avatar Link"
					href="https://example.com"
					isRemovable={false}
					testId={testId}
					type="user"
					avatar={Avatar}
				/>,
			);

			const link = screen.getByTestId(`${testId}--link`);
			expect(link).toHaveAttribute('href', 'https://example.com');

			await userEvent.click(link);
		});

		it('should fire analytics event when avatar onClick is triggered', async () => {
			const onEvent = jest.fn();

			function WithAnalyticsListener() {
				return (
					<AnalyticsListener onEvent={onEvent}>
						<AvatarTag
							text="Avatar Link"
							href="https://example.com"
							onClick={(_event: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => {
								analyticsEvent.fire();
							}}
							isRemovable={false}
							testId={testId}
							type="user"
							avatar={Avatar}
						/>
					</AnalyticsListener>
				);
			}

			render(<WithAnalyticsListener />);
			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);

			expect(onEvent).toHaveBeenCalledTimes(1);
			expect(onEvent.mock.calls[0][0]).toBeInstanceOf(UIAnalyticsEvent);
		});
	});

	describe('Removable link tag interactions', () => {
		const testId = 'removable-link-tag';

		it('should fire analytics when removable link tag is clicked', async () => {
			const onEvent = jest.fn();

			function WithAnalyticsListener() {
				return (
					<AnalyticsListener onEvent={onEvent}>
						<TagNew
							text="Removable Link"
							href="https://example.com"
							onClick={(_event: React.MouseEvent<HTMLAnchorElement>, analyticsEvent: UIAnalyticsEvent) => {
								analyticsEvent.fire();
							}}
							isRemovable={true}
							testId={testId}
						/>
					</AnalyticsListener>
				);
			}

			render(<WithAnalyticsListener />);
			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);

			expect(onEvent).toHaveBeenCalledTimes(1);
			expect(onEvent.mock.calls[0][0]).toBeInstanceOf(UIAnalyticsEvent);
		});

		it('should call onBeforeRemoveAction when remove button is clicked', async () => {
			const onBeforeRemove = jest.fn(() => true);
			const testId = 'removable-before-action';

			render(
				<TagNew
					text="Removable Tag"
					isRemovable={true}
					onBeforeRemoveAction={onBeforeRemove}
					testId={testId}
				/>,
			);

			const removeButton = screen.getByTestId(`close-button-${testId}`);
			await userEvent.click(removeButton);

			expect(onBeforeRemove).toHaveBeenCalledTimes(1);
		});

		it('should call onAfterRemoveAction with text when tag is removed', async () => {
			const onAfterRemove = jest.fn();
			const testId = 'removable-after-action';

			render(
				<TagNew
					text="Removable Tag"
					isRemovable={true}
					onBeforeRemoveAction={() => true}
					onAfterRemoveAction={onAfterRemove}
					testId={testId}
				/>,
			);

			const removeButton = screen.getByTestId(`close-button-${testId}`);
			await userEvent.click(removeButton);

			expect(onAfterRemove).toHaveBeenCalledTimes(1);
			const [text] = onAfterRemove.mock.calls[0];
			expect(text).toBe('Removable Tag');
		});

		it('should call onClick on tag click and removal handlers on button click separately', async () => {
			const onClickHandler = jest.fn();
			const onRemove = jest.fn(() => true);

			render(
				<TagNew
					text="Removable Link"
					href="https://example.com"
					onClick={onClickHandler}
					isRemovable={true}
					onBeforeRemoveAction={onRemove}
					testId={testId}
				/>,
			);

			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);
			expect(onClickHandler).toHaveBeenCalledTimes(1);
			expect(onRemove).not.toHaveBeenCalled();

			const removeButton = screen.getByTestId(`close-button-${testId}`);
			await userEvent.click(removeButton);
			expect(onRemove).toHaveBeenCalledTimes(1);
			expect(onClickHandler).toHaveBeenCalledTimes(1);
		});

		it('should handle both onClick and removal actions with complete handlers', async () => {
			const onClickHandler = jest.fn();
			const onBeforeRemove = jest.fn(() => true);
			const onAfterRemove = jest.fn();

			render(
				<TagNew
					text="Full Handlers"
					href="https://example.com"
					onClick={onClickHandler}
					isRemovable={true}
					onBeforeRemoveAction={onBeforeRemove}
					onAfterRemoveAction={onAfterRemove}
					testId={testId}
				/>,
			);

			const link = screen.getByTestId(`${testId}--link`);
			await userEvent.click(link);
			await userEvent.click(link);

			expect(onClickHandler).toHaveBeenCalledTimes(2);
			expect(onBeforeRemove).not.toHaveBeenCalled();
			expect(onAfterRemove).not.toHaveBeenCalled();

			const removeButton = screen.getByTestId(`close-button-${testId}`);
			await userEvent.click(removeButton);

			expect(onBeforeRemove).toHaveBeenCalledTimes(1);
			expect(onAfterRemove).toHaveBeenCalledTimes(1);
			expect(onClickHandler).toHaveBeenCalledTimes(2);
		});
	});
});
