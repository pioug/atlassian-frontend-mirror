import React, { useCallback } from 'react';

import { type JsonLd } from 'json-ld-types';

import Button from '@atlaskit/button/new';
import { DatePicker, DateTimePicker } from '@atlaskit/datetime-picker';
import Form, { Field } from '@atlaskit/form';
import Lozenge from '@atlaskit/lozenge';
import { Box, Grid, Stack } from '@atlaskit/primitives';
import { RadioGroup } from '@atlaskit/radio';
import Textfield from '@atlaskit/textfield';

import CollapsibleSection from './collapsible-section';
import CustomFieldset from './custom-fieldset';
import { transform } from './transform';

const JsonLdGenerator = ({ onSubmit }: { onSubmit: (response: JsonLd.Response) => void }) => {
	const handleSubmit = useCallback(
		(formState) => {
			const jsonLd = transform(formState);
			onSubmit(jsonLd);
		},
		[onSubmit],
	);

	return (
		<Form onSubmit={handleSubmit}>
			{({ formProps }) => (
				<form {...formProps} name="load-link">
					<Stack>
						<Field
							aria-required={true}
							defaultValue="https://example-url"
							label="URL"
							isRequired
							name="url"
						>
							{({ fieldProps }) => <Textfield {...fieldProps} />}
						</Field>
						<Field defaultValue="Example link title" label="Link title" name="title">
							{({ fieldProps }) => <Textfield {...fieldProps} />}
						</Field>
						<CollapsibleSection title="Add link details">
							<CustomFieldset legend="Link provider" templateColumns="1fr 1fr">
								<Field defaultValue="" label="Name" name="providerName">
									{({ fieldProps }) => (
										<Textfield placeholder="E.g. Jira, Confluence, Trello..." {...fieldProps} />
									)}
								</Field>
								<Field defaultValue="" label="Icon URL" name="providerIconUrl">
									{({ fieldProps }) => <Textfield {...fieldProps} />}
								</Field>
							</CustomFieldset>
							<Field defaultValue="" label="Link icon URL" name="iconUrl">
								{({ fieldProps }) => <Textfield {...fieldProps} />}
							</Field>
							<Field defaultValue="" label="Link description" name="description">
								{({ fieldProps }) => <Textfield {...fieldProps} />}
							</Field>
							<Field defaultValue="" label="Thumbnail URL" name="thumbnailUrl">
								{({ fieldProps }) => <Textfield {...fieldProps} />}
							</Field>
							<Field defaultValue="" label="Embed URL" name="embedUrl">
								{({ fieldProps }) => <Textfield {...fieldProps} />}
							</Field>
							{/*<Field defaultValue="" label="Aspect Ratio" name="embedAspectRatio">*/}
							{/*	{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}*/}
							{/*</Field>*/}
							<Field defaultValue="" label="Download URL" name="downloadUrl">
								{({ fieldProps }) => <Textfield {...fieldProps} />}
							</Field>
							<CustomFieldset legend="Created by" templateColumns="1fr 1fr">
								<Field defaultValue="" label="Name" name="createdByName">
									{({ fieldProps }) => <Textfield placeholder="E.g. Jane Smith" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="Image URL" name="createdByImageUrl">
									{({ fieldProps }) => <Textfield {...fieldProps} />}
								</Field>
							</CustomFieldset>
							<Field defaultValue="" label="Updated on" name="updatedOn">
								{({ fieldProps }) => <DateTimePicker {...fieldProps} />}
							</Field>
							<Field defaultValue="" label="Due on" name="dueOn">
								{({ fieldProps }) => <DatePicker {...fieldProps} />}
							</Field>
							<CustomFieldset legend="Status" templateColumns="1fr 1fr">
								<Field defaultValue="" label="Name" name="statusLabel">
									{({ fieldProps }) => (
										<Textfield placeholder="E.g. Completed 🎉" {...fieldProps} />
									)}
								</Field>
								<Field defaultValue="default" label="Appearance" name="statusAppearance">
									{({ fieldProps }) => (
										<RadioGroup
											{...fieldProps}
											options={[
												{
													name: 'statusAppearance',
													label: <Lozenge>Default</Lozenge>,
													value: 'default',
												},
												{
													name: 'statusAppearance',
													label: <Lozenge appearance="inprogress">In progress</Lozenge>,
													value: 'inprogress',
												},
												{
													name: 'statusAppearance',
													label: <Lozenge appearance="moved">Moved</Lozenge>,
													value: 'moved',
												},
												{
													name: 'statusAppearance',
													label: <Lozenge appearance="new">New</Lozenge>,
													value: 'new',
												},
												{
													name: 'statusAppearance',
													label: <Lozenge appearance="removed">Removed</Lozenge>,
													value: 'removed',
												},
												{
													name: 'statusAppearance',
													label: <Lozenge appearance="success">Success</Lozenge>,
													value: 'success',
												},
											]}
										/>
									)}
								</Field>
							</CustomFieldset>
							<CustomFieldset legend="Priority" templateColumns="1fr 1fr">
								<Field defaultValue="" label="Name" name="priorityName">
									{({ fieldProps }) => (
										<Textfield placeholder="E.g. Minor, Major..." {...fieldProps} />
									)}
								</Field>
								<Field defaultValue="" label="Icon URL" name="priorityIconUrl">
									{({ fieldProps }) => <Textfield {...fieldProps} />}
								</Field>
							</CustomFieldset>
							<Grid gap="space.100" templateColumns="1fr 1fr">
								<Field defaultValue="" label="Attachment count" name="attachmentCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="Comment count" name="commentCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="React count" name="reactCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="View count" name="viewCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="Vote count" name="voteCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="Subscriber count" name="subscriberCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="Read time in minutes" name="readTime">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
							</Grid>
							<CustomFieldset legend="Subtask progress" templateColumns="1fr 1fr">
								<Field defaultValue="" label="Resolved count" name="subTaskProgressCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="Total count" name="subTaskProgressTotalCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
							</CustomFieldset>
							<CustomFieldset legend="Checked item progress" templateColumns="1fr 1fr">
								<Field defaultValue="" label="Checked items" name="checkedItemProgressCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
								<Field defaultValue="" label="Total" name="checkedItemProgressTotalCount">
									{({ fieldProps }) => <Textfield type="number" {...fieldProps} />}
								</Field>
							</CustomFieldset>
						</CollapsibleSection>

						<Box paddingBlockStart="space.100">
							<Button type="submit" appearance="primary">
								Generate JSON-LD
							</Button>
						</Box>
					</Stack>
				</form>
			)}
		</Form>
	);
};

export default JsonLdGenerator;
