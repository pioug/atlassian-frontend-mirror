// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { MockMentionResource } from '@atlaskit/util-data-test/mock-mention-resource';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mentionTestResult as mentions } from '@atlaskit/util-data-test/mention-test-data';
import React from 'react';
import MentionPicker, {
	type OnClose,
	type OnOpen,
	type Props,
} from '../../../components/MentionPicker';
import * as Analytics from '../../../util/analytics';
import { screen, render, act, waitFor } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';
import userEvent from '@testing-library/user-event';

const MAX_NOTIFIED_ITEMS = 20;

type RenderHelperProps = {
	props?: Props;
	renderInternal: ReturnType<typeof render>;
	resourceProvider: MockMentionResource;
};

type PropsWithoutResource = Omit<Props, 'resourceProvider'>;
const setupPicker = (
	props?: PropsWithoutResource,
	ref?: React.RefObject<MentionPicker>,
): RenderHelperProps => {
	const resourceProvider = new MockMentionResource({
		minWait: 0,
		maxWait: 0,
	});
	return {
		renderInternal: render(
			<IntlProvider locale="en">
				<MentionPicker resourceProvider={resourceProvider} query="" {...props} ref={ref} />
			</IntlProvider>,
		),
		resourceProvider,
	};
};

const reRenderPicker = (renderHelper: RenderHelperProps, props?: PropsWithoutResource): void => {
	renderHelper.renderInternal.rerender(
		<IntlProvider locale="en">
			<MentionPicker resourceProvider={renderHelper.resourceProvider} query="" {...props} />
		</IntlProvider>,
	);
};

const hasNoItems = async (renderHelper: RenderHelperProps) => {
	return await waitFor(async () => {
		expect(
			renderHelper.renderInternal.container.querySelectorAll(`[data-mention-item]`),
		).toHaveLength(0);
	});
};

const hasSomeItems = async (renderHelper: RenderHelperProps) => {
	return await waitFor(async () => {
		expect(
			renderHelper.renderInternal.container.querySelectorAll(`[data-mention-item]`),
		).not.toHaveLength(0);
	});
};

const hasExpectedItems = async (renderHelper: RenderHelperProps, numItems: number) => {
	return await waitFor(async () => {
		expect(
			renderHelper.renderInternal.container.querySelectorAll(`[data-mention-item]`),
		).toHaveLength(numItems);
	});
};

const hasSelectedMentionById = async (renderHelper: RenderHelperProps, mentionId: string) => {
	return await waitFor(async () => {
		const mentionById = renderHelper.renderInternal.container.querySelector(
			`[data-mention-id="${mentionId}"]`,
		);
		expect(mentionById?.getAttribute('data-selected')).toEqual('true');
	});
};

// TODO: After updating to expect.hasAssertions(), it identified some tests that are not correctly written.
// Please refer to: https://product-fabric.atlassian.net/browse/FS-4183
describe('MentionPicker', () => {
	it('should accept all mention names by default', async () => {
		const component = setupPicker();
		expect(component).toBeDefined();
		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);

		await expect(document.body).toBeAccessible();
	});

	it('should accept limit result to starting with s', async () => {
		const component = setupPicker({
			query: 's',
		} as Props);
		expect(component).toBeDefined();
		await hasExpectedItems(component, 6);

		await expect(document.body).toBeAccessible();
	});

	it('should fire SLI analytcs after search', async () => {
		const analytics = jest.spyOn(Analytics, 'fireSliAnalyticsEvent');
		const component = setupPicker({
			query: 's',
		} as Props);
		expect(component).toBeDefined();

		await hasExpectedItems(component, 6);
		expect(analytics).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should accept limit result to starting with shae', async () => {
		const component = setupPicker({
			query: 'shae',
		} as Props);
		expect(component).toBeDefined();
		await hasExpectedItems(component, 1);

		await expect(document.body).toBeAccessible();
	});

	it('should report error when service fails', async () => {
		const component = setupPicker();
		expect(component).toBeDefined();

		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);
		reRenderPicker(component, { query: 'nothing' });
		await hasSomeItems(component);
		reRenderPicker(component, { query: 'error' });
		await hasNoItems(component);

		await expect(document.body).toBeAccessible();
	});

	it('should display particular message for 401 HTTP response', async () => {
		const component = setupPicker();

		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);
		reRenderPicker(component, { query: 'nothing' });
		await hasSomeItems(component);
		reRenderPicker(component, { query: '401' });
		await hasNoItems(component);

		expect(await screen.findByText('Try logging out then in again')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should display particular message for 403 HTTP response', async () => {
		const component = setupPicker();

		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);
		reRenderPicker(component, { query: 'nothing' });
		await hasSomeItems(component);
		reRenderPicker(component, { query: '403' });
		await hasNoItems(component);

		expect(await screen.findByText('Try entering different text')).toBeInTheDocument();

		await expect(document.body).toBeAccessible();
	});

	it('should display previous mention if error straight after', async () => {
		const component = setupPicker();
		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);
		reRenderPicker(component, { query: 'shae' });
		await hasExpectedItems(component, 1);
		reRenderPicker(component, { query: 'error' });
		await hasExpectedItems(component, 1);

		await expect(document.body).toBeAccessible();
	});

	it('should change selection when navigating next', async () => {
		const ref = React.createRef<MentionPicker>();
		const component = setupPicker(undefined, ref);

		await hasSelectedMentionById(component, mentions[0].id);

		act(() => ref.current?.selectNext());
		await hasSelectedMentionById(component, mentions[1].id);

		await expect(document.body).toBeAccessible();
	});

	it('should change selection when selectIndex called', async () => {
		const ref = React.createRef<MentionPicker>();
		const component = setupPicker(undefined, ref);

		await hasSelectedMentionById(component, mentions[0].id);

		act(() => ref.current?.selectIndex(2));
		await hasSelectedMentionById(component, mentions[2].id);

		await expect(document.body).toBeAccessible();
	});

	it('should change selection when selectId called', async () => {
		const ref = React.createRef<MentionPicker>();
		const component = setupPicker(undefined, ref);

		await hasSelectedMentionById(component, mentions[0].id);

		act(() => ref.current?.selectId(mentions[2].id));
		await hasSelectedMentionById(component, mentions[2].id);

		await expect(document.body).toBeAccessible();
	});

	it('should change selection when navigating previous', async () => {
		const ref = React.createRef<MentionPicker>();
		const component = setupPicker(undefined, ref);

		await hasSelectedMentionById(component, mentions[0].id);

		act(() => ref.current?.selectNext());
		await hasSelectedMentionById(component, mentions[1].id);

		act(() => ref.current?.selectPrevious());
		await hasSelectedMentionById(component, mentions[0].id);

		await expect(document.body).toBeAccessible();
	});

	it('should choose current selection when chooseCurrentSelection called', async () => {
		const spy = jest.fn();

		const ref = React.createRef<MentionPicker>();
		const component = setupPicker(
			{
				onSelection: spy,
			},
			ref,
		);

		await hasSelectedMentionById(component, mentions[0].id);

		act(() => ref.current?.selectIndex(2));
		await hasSelectedMentionById(component, mentions[2].id);

		act(() => ref.current?.chooseCurrentSelection());
		expect(spy).toHaveBeenCalled();
		expect(spy).toHaveBeenLastCalledWith(mentions[2]);

		await expect(document.body).toBeAccessible();
	});

	it('should choose clicked selection when item clicked', async () => {
		const user = userEvent.setup();
		const spy = jest.fn();

		const ref = React.createRef<MentionPicker>();
		const component = setupPicker(
			{
				onSelection: spy,
			},
			ref,
		);
		await hasSelectedMentionById(component, mentions[0].id);

		act(() => ref.current?.selectIndex(2));
		await hasSelectedMentionById(component, mentions[2].id);

		await waitFor(async () => {
			const trigger = screen.getByTestId(`mention-item-${mentions[1].id}`);
			await user.click(trigger);
		});

		expect(spy).toHaveBeenCalled();
		expect(spy).toHaveBeenLastCalledWith(mentions[1]);

		await expect(document.body).toBeAccessible();
	});

	it('should fire onOpen when first result shown', async () => {
		const onOpen = jest.fn();
		const onClose = jest.fn();

		const component = setupPicker({
			onOpen: onOpen as OnOpen,
			onClose: onClose as OnClose,
		});

		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);
		expect(onOpen).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(0);

		await expect(document.body).toBeAccessible();
	});

	it('should fire onClose when no matches', async () => {
		const onOpen = jest.fn();
		const onClose = jest.fn();

		const component = setupPicker({
			onOpen: onOpen,
			onClose: onClose,
		});
		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);
		expect(onOpen).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(0);

		reRenderPicker(component, {
			onOpen: onOpen,
			onClose: onClose,
			query: 'nothing',
		});
		await hasNoItems(component);

		expect(onOpen).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);

		await expect(document.body).toBeAccessible();
	});

	it('should fire onOpen when error to display', async () => {
		const onOpen = jest.fn();
		const onClose = jest.fn();

		const component = setupPicker({
			onOpen: onOpen,
			onClose: onClose,
		});
		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);

		reRenderPicker(component, {
			onOpen: onOpen,
			onClose: onClose,
			query: 'error',
		});
		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);

		expect(onOpen).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(0);

		await expect(document.body).toBeAccessible();
	});

	it('mentionsCount returns the number of mentions in the list', async () => {
		const ref = React.createRef<MentionPicker>();
		const component = setupPicker({}, ref);

		await hasExpectedItems(component, MAX_NOTIFIED_ITEMS);

		await waitFor(async () => expect(ref.current?.mentionsCount()).toEqual(MAX_NOTIFIED_ITEMS));

		await expect(document.body).toBeAccessible();
	});
});
