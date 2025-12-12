// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { mentionTestResult } from '@atlaskit/util-data-test/mention-test-data';
import React from 'react';
import MentionList from '../../../components/MentionList';
import { IntlProvider } from 'react-intl-next';
import { screen, render, act } from '@testing-library/react';

// TODO: After updating to expect.hasAssertions() and RTL, it identified some tests that are not correctly written.
// Please refer to: https://product-fabric.atlassian.net/browse/FS-4183
describe('MentionList', () => {
	describe('MentionList without initial element', () => {
		it('should have first item selected by default', async () => {
			const { container } = render(
				<IntlProvider locale="en">
					<MentionList mentions={mentionTestResult} />
				</IntlProvider>,
			);

			const item = container.querySelector(`[data-mention-id="${mentionTestResult[0].id}"]`);
			expect(item?.getAttribute('data-selected')).toEqual('true');

			await expect(document.body).toBeAccessible();
		});

		it('selectIndex selects correct item', async () => {
			const ref = React.createRef<MentionList>();
			const { container } = render(
				<IntlProvider locale="en">
					<MentionList mentions={mentionTestResult} ref={ref} />
				</IntlProvider>,
			);

			act(() => ref.current?.selectIndex(2));
			const item = container.querySelector(`[data-mention-id="${mentionTestResult[2].id}"]`);
			expect(item?.getAttribute('data-selected')).toEqual('true');

			await expect(document.body).toBeAccessible();
		});

		it('selectId selects correct item', async () => {
			const ref = React.createRef<MentionList>();
			const { container } = render(
				<IntlProvider locale="en">
					<MentionList mentions={mentionTestResult} ref={ref} />
				</IntlProvider>,
			);

			act(() => ref.current?.selectId(mentionTestResult[2].id));
			const firstItem = container.querySelector(`[data-mention-id="${mentionTestResult[2].id}"]`);
			expect(firstItem?.getAttribute('data-selected')).toEqual('true');

			await expect(document.body).toBeAccessible();
		});

		it('mentionsCount returns the number of mentions in the list', async () => {
			const ref = React.createRef<MentionList>();
			render(
				<IntlProvider locale="en">
					<MentionList mentions={mentionTestResult} ref={ref} />
				</IntlProvider>,
			);

			expect(ref.current?.mentionsCount()).toEqual(mentionTestResult.length);

			await expect(document.body).toBeAccessible();
		});

		it('should retain a deliberate selection across changing list of mentions', async () => {
			const ref = React.createRef<MentionList>();
			const { rerender, container } = render(
				<IntlProvider locale="en">
					<MentionList mentions={mentionTestResult} ref={ref} />
				</IntlProvider>,
			);

			// select item 3 in the mention list
			act(() => ref.current?.selectIndex(2));
			const thirdItem = container.querySelector(`[data-mention-id="${mentionTestResult[2].id}"]`);
			expect(thirdItem?.getAttribute('data-selected')).toEqual('true');

			// remove the first item from the mentions array and set the new mentions
			const reducedMentionsList = mentionTestResult.slice(1);
			rerender(
				<IntlProvider locale="en">
					<MentionList mentions={reducedMentionsList} ref={ref} />
				</IntlProvider>,
			);

			// ensure item 2 is now selected
			const secondItem = container.querySelector(
				`[data-mention-id="${reducedMentionsList[1].id}"]`,
			);
			expect(secondItem?.getAttribute('data-selected')).toEqual('true');

			await expect(document.body).toBeAccessible();
		});

		it('should select first item for each changing set of mentions if no deliberate selection is made', () => {
			const ref = React.createRef<MentionList>();
			const { rerender, container } = render(
				<IntlProvider locale="en">
					<MentionList mentions={mentionTestResult} ref={ref} />
				</IntlProvider>,
			);

			const item = container.querySelector(`[data-mention-id="${mentionTestResult[0].id}"]`);
			expect(item?.getAttribute('data-selected')).toEqual('true');

			// move the first item to the third position in a new list.
			// Note that I've also removed a single item from the list so I can differentiate when the new mentions are shown using length
			const reducedMentionsList = [
				...mentionTestResult.slice(1, 3),
				mentionTestResult[0],
				...mentionTestResult.slice(4),
			];
			rerender(
				<IntlProvider locale="en">
					<MentionList mentions={reducedMentionsList} ref={ref} />
				</IntlProvider>,
			);

			const reducedItem = container.querySelector(
				`[data-mention-id="${reducedMentionsList[0].id}"]`,
			);
			expect(reducedItem?.getAttribute('data-selected')).toEqual('true');
		});
	});
	describe('MentionList with initial highlight', () => {
		it('should have first item selected by default', async () => {
			const ref = React.createRef<MentionList>();
			const HighlightItem = <div id="highlight">Initial highlight information</div>;
			const { container } = render(
				<IntlProvider locale="en">
					<MentionList
						mentions={mentionTestResult}
						initialHighlightElement={HighlightItem}
						ref={ref}
					/>
				</IntlProvider>,
			);

			const item = container.querySelector(`[data-mention-id="${mentionTestResult[0].id}"]`);
			expect(item?.getAttribute('data-selected')).toEqual('true');

			await expect(document.body).toBeAccessible();
		});

		it('should render intitialHighlight', async () => {
			const ref = React.createRef<MentionList>();
			const HighlightItem = <div data-testid="highlight">Initial highlight information</div>;
			render(
				<IntlProvider locale="en">
					<MentionList
						mentions={mentionTestResult}
						initialHighlightElement={HighlightItem}
						ref={ref}
					/>
				</IntlProvider>,
			);

			const highlight = screen.getByTestId('highlight');
			expect(highlight).toBeInTheDocument();

			await expect(document.body).toBeAccessible();
		});
	});
});
