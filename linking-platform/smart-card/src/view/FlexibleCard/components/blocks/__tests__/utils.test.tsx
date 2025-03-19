import React from 'react';

import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import context from '../../../../../__fixtures__/flexible-ui-data-context';
import { ElementName, SmartLinkStatus } from '../../../../../constants';
import { FlexibleUiContext } from '../../../../../state/flexible-ui-context';
import { type ElementItem } from '../../blocks/types';
import Block from '../block';
import { MetadataBlock } from '../index';
import { ElementDisplaySchema, type ElementDisplaySchemaType, renderElementItems } from '../utils';

const TestRenderElementItemBlock = ({
	display,
	metadata = [],
}: {
	display: ElementDisplaySchemaType;
	metadata: ElementItem[];
}) => {
	return <Block>{renderElementItems(metadata, display)}</Block>;
};

describe('renderElementItems', () => {
	const getElementTestId = (name: ElementName, testId: string) => {
		switch (name) {
			case ElementName.AuthorGroup:
			case ElementName.CollaboratorGroup:
			case ElementName.OwnedByGroup:
			case ElementName.AssignedToGroup:
				return `${testId}--avatar-group`;
			default:
				return testId;
		}
	};

	const renderTestBlock = (
		display: ElementDisplaySchemaType,
		name: ElementName,
		testId: string,
	) => {
		const metadata = [{ name, testId }] as ElementItem[];
		return render(
			<IntlProvider locale="en">
				<FlexibleUiContext.Provider value={context}>
					<TestRenderElementItemBlock display={display} metadata={metadata} />
				</FlexibleUiContext.Provider>
			</IntlProvider>,
		);
	};

	// If you are here because you've added a new element and these
	// tests fail, it could be that you haven't added the element
	// into ElementDisplaySchema. Another likely reason is that you
	// need to add or modify the mock data being passed as the value
	// to FlexibleUiContext.Provider
	describe.each([['inline' as ElementDisplaySchemaType], ['block' as ElementDisplaySchemaType]])(
		'with %s display schema',
		(display: ElementDisplaySchemaType) => {
			const testId = 'smart-element-test';
			const expectToRendered = Object.values(ElementName).filter((name) =>
				ElementDisplaySchema[name].includes(display),
			);
			const expectedNotToRendered = Object.values(ElementName).filter(
				(name) => !ElementDisplaySchema[name].includes(display),
			);

			it.each(expectToRendered)('renders element %s', async (name: ElementName) => {
				renderTestBlock(display, name, testId);
				const element = await screen.findByTestId(getElementTestId(name, testId));
				expect(element).toBeDefined();
			});

			it.each(expectedNotToRendered)('does not render element %s ', (name: ElementName) => {
				renderTestBlock(display, name, testId);
				const element = screen.queryByTestId(getElementTestId(name, testId));
				expect(element).toBeNull();
			});
		},
	);

	it('does not render null element', async () => {
		render(
			<FlexibleUiContext.Provider value={{ title: 'Link title' }}>
				<MetadataBlock
					primary={[{ name: ElementName.CommentCount, testId: 'comment-count' }]}
					status={SmartLinkStatus.Resolved}
				/>
			</FlexibleUiContext.Provider>,
		);
		expect(screen.queryByTestId('comment-count')).toBeNull();
	});

	it('does not render non-flexible-ui element', async () => {
		const elements = renderElementItems([
			// @ts-ignore: This violation is intentional for testing purpose.
			{ name: 'random-node' as ElementName },
		]);

		expect(elements).toBeUndefined();
	});
});
