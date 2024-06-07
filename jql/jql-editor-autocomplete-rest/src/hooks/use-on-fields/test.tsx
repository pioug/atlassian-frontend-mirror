import React, { useRef } from 'react';

import { render } from '@testing-library/react';
import { from } from 'rxjs/observable/from';

import { type AutocompleteOptions, type JQLClause } from '@atlaskit/jql-editor-common';

import {
	accountJqlField,
	accountManagerJqlField,
	assigneeJqlField,
	cfidField,
	collapsedCustomField,
	componentJqlField,
	deprecatedEpicLinkField,
	deprecatedParentLinkField,
	doubleQuotedJqlField,
	nonAutocompletableField,
	nonOrderableJqlField,
	nonSearchableJqlField,
	singleQuotedJqlField,
	statusJqlField,
} from '../../common/mocks';
import { type JQLFieldResponse } from '../../common/types';
import { normalize } from '../../utils/strings';

import useOnFields, { getFieldType, MAX_VISIBLE_OPTIONS } from './index';

const mockJqlSearchableFields: JQLFieldResponse[] = [
	accountJqlField,
	accountManagerJqlField,
	assigneeJqlField,
	componentJqlField,
	doubleQuotedJqlField,
	singleQuotedJqlField,
	statusJqlField,
	nonOrderableJqlField,
	nonAutocompletableField,
	collapsedCustomField,
	deprecatedEpicLinkField,
	deprecatedParentLinkField,
];

const mockJqlOrderableFields: JQLFieldResponse[] = [
	accountJqlField,
	accountManagerJqlField,
	assigneeJqlField,
	componentJqlField,
	doubleQuotedJqlField,
	singleQuotedJqlField,
	statusJqlField,
	nonSearchableJqlField,
	nonAutocompletableField,
	collapsedCustomField,
	deprecatedEpicLinkField,
	deprecatedParentLinkField,
];

const mapToAutocompleteOptions = (data: JQLFieldResponse[]): AutocompleteOptions =>
	data.map((item) => {
		let name = item.displayName;
		const fieldType = getFieldType(item);
		if (fieldType !== null) {
			name = item.displayName.replace(` - ${normalize(item.value)}`, '');
		}
		return {
			name,
			value: item.value,
			...(fieldType !== null && { fieldType }),
			isDeprecated: item.deprecated === 'true',
			deprecatedSearcherKey: item.deprecatedSearcherKey,
		};
	});

describe('onFields', () => {
	type OnFieldsConsumerProps = {
		jqlSearchableFields?: JQLFieldResponse[];
		jqlOrderableFields?: JQLFieldResponse[];
		query?: string;
		clause?: JQLClause;
		done: jest.DoneCallback;
		onAssert: (fields: AutocompleteOptions) => void;
	};

	const OnFieldsConsumer = ({
		jqlSearchableFields = [],
		jqlOrderableFields = [],
		onAssert,
		query,
		clause = 'where',
		done,
	}: OnFieldsConsumerProps) => {
		const onFields = useOnFields(from(jqlSearchableFields), from(jqlOrderableFields));
		const fields = useRef<AutocompleteOptions>([]);

		onFields(query, clause).subscribe({
			next: (data) => {
				fields.current = data;
			},
			complete: () => {
				try {
					onAssert(fields.current);
					done();
				} catch (e) {
					done(e);
				}
			},
		});

		return null;
	};

	it('returns all searchable JQL fields when no query is provided', (done) => {
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions(mockJqlSearchableFields);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				done={done}
			/>,
		);
	});

	it('returns JQL fields when the displayName starts with the provided query', (done) => {
		const query = 'account';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountJqlField, accountManagerJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('returns JQL fields when the value starts with the provided query', (done) => {
		const query = 'cf';
		const assertFields = (fields: AutocompleteOptions) => {
			// Only component field should be returned with query = 'cf'
			const expectedFields = mapToAutocompleteOptions([componentJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it(`returns a maximum of ${MAX_VISIBLE_OPTIONS} fields`, (done) => {
		const moreThanMaxJqlFields: JQLFieldResponse[] = [];
		const extraFields = 1;
		// eslint-disable-next-line no-plusplus
		for (let i = 0; i < MAX_VISIBLE_OPTIONS + extraFields; i++) {
			moreThanMaxJqlFields.push(statusJqlField);
		}

		const assertFields = (fields: AutocompleteOptions) => {
			// Exclude all fields which exceed MAX_VISIBLE_OPTIONS
			const expectedFields = mapToAutocompleteOptions(moreThanMaxJqlFields).slice(0, -extraFields);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={moreThanMaxJqlFields}
				onAssert={assertFields}
				done={done}
			/>,
		);
	});

	it('ignores double quotes in user query when matching fields', (done) => {
		const query = '"account';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountJqlField, accountManagerJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('ignores single quotes in user query when matching fields', (done) => {
		const query = "'account";
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountJqlField, accountManagerJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('supports searching by multiple words in double quoted strings', (done) => {
		const query = '"account mana';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountManagerJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('supports searching by multiple words in single quoted strings', (done) => {
		const query = "'account mana";
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountManagerJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('only returns exact matches when query is surrounded by double quotes', (done) => {
		const query = '"account"';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('only returns exact matches when query is surrounded by single quotes', (done) => {
		const query = "'account'";
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('matches multi-word quoted values when query is surrounded by double quotes', (done) => {
		const query = '"Account manager"';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountManagerJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('matches multi-word quoted values when query is surrounded by single quotes', (done) => {
		const query = "'Account manager'";
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([accountManagerJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('matches custom fields with double quotes when query is single quoted', (done) => {
		const query = '\'Field with "';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([doubleQuotedJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('matches custom fields with double quotes when query is double quoted', (done) => {
		const query = '"Field with \\"';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([doubleQuotedJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('matches custom fields with single quotes when query is single quoted', (done) => {
		const query = "'Field with \\'";
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([singleQuotedJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('matches custom fields with single quotes when query is double quoted', (done) => {
		const query = '"Field with \'';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([singleQuotedJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('ignores case and accented characters', (done) => {
		const query = 'asSiGnèe';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([assigneeJqlField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('returns all orderable JQL fields for order by clauses', (done) => {
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions(mockJqlOrderableFields);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlOrderableFields={mockJqlOrderableFields}
				onAssert={assertFields}
				done={done}
				clause={'orderBy'}
			/>,
		);
	});

	it('maps field type and display name for collapsed custom fields', (done) => {
		const fieldsWithSquareBrackets = [collapsedCustomField, cfidField];
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = [
				{
					name: 'Collapsed',
					value: collapsedCustomField.value,
					fieldType: 'Dropdown',
					isDeprecated: false,
				},
				{
					name: cfidField.displayName,
					value: cfidField.value,
					isDeprecated: false,
				},
			];
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlOrderableFields={fieldsWithSquareBrackets}
				onAssert={assertFields}
				done={done}
				clause={'orderBy'}
			/>,
		);
	});

	it('shows deprecated property and deprecatedSearcherKey when field is deprecated in searchable fields - Epic Link', (done) => {
		const query = '"Epic Link';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([deprecatedEpicLinkField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('shows deprecated property and deprecatedSearcherKey when field is deprecated in searchable fields - Parent Link', (done) => {
		const query = '"Parent Link';
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([deprecatedParentLinkField]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlSearchableFields={mockJqlSearchableFields}
				onAssert={assertFields}
				query={query}
				done={done}
			/>,
		);
	});

	it('shows deprecated property and deprecatedSearcherKey when field is deprecated in orderable fields', (done) => {
		const deprecatedFields = [deprecatedEpicLinkField, deprecatedParentLinkField];
		const assertFields = (fields: AutocompleteOptions) => {
			const expectedFields = mapToAutocompleteOptions([
				deprecatedEpicLinkField,
				deprecatedParentLinkField,
			]);
			expect(fields).toEqual(expectedFields);
		};

		render(
			<OnFieldsConsumer
				jqlOrderableFields={deprecatedFields}
				onAssert={assertFields}
				done={done}
				clause={'orderBy'}
			/>,
		);
	});
});
