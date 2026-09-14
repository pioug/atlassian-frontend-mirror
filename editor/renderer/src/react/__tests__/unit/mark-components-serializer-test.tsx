import React from 'react';
import { defaultSchema as schema } from '@atlaskit/adf-schema/schema-default';
import { render } from '@atlassian/testing-library/render';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { ReactSerializer } from '../../../index';
import { complexDocument as doc } from './__fixtures__/documents';
import * as NodeUtil from '../../nodes';
import * as MarkUtil from '../../marks';

describe('Renderer - ReactSerializer - TextWrapperComponent', () => {
	let docFromSchema: PMNode;
	beforeAll(() => {
		docFromSchema = schema.nodeFromJSON(doc);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	const FakeComp = ({ children }: React.PropsWithChildren<unknown>) => {
		return <>children</>;
	};
	describe('when surroundTextNodesWithTextWrapper is true', () => {
		it('should not serialize Mark or Node component using a duplicated key', () => {
			jest.spyOn(NodeUtil, 'toReact').mockReturnValue(FakeComp);
			jest.spyOn(MarkUtil, 'toReact').mockReturnValue(FakeComp);
			const createElementSpy = jest.spyOn(React, 'createElement');
			const reactSerializer = new ReactSerializer({
				surroundTextNodesWithTextWrapper: true,
			});

			render(<>{reactSerializer.serializeFragment(docFromSchema.content)}</>);

			expect(createElementSpy).toHaveBeenCalled();
			const keys = new Set();

			createElementSpy.mock.calls.forEach((call) => {
				if (!call || !call[1] || !call[1].key) {
					return;
				}

				const elementKey = call[1].key;

				if (keys.has(elementKey)) {
					fail(`The key: ${elementKey} as added twice`);
				} else {
					keys.add(elementKey);
				}
			});
		});
	});
});
