import React, { useState } from 'react';

import Button, { IconButton } from '@atlaskit/button/new';
import { FlagGroup } from '@atlaskit/flag';
import { ErrorMessage, Field } from '@atlaskit/form';
import ThumbsDownIcon from '@atlaskit/icon/core/thumbs-down';
import ThumbsUpIcon from '@atlaskit/icon/core/thumbs-up';
import { Box, Inline } from '@atlaskit/primitives/compiled';
import Textfield from '@atlaskit/textfield';
import VisuallyHidden from '@atlaskit/visually-hidden';

import FeedbackCollector, { FeedbackFlag } from '../src';

const CustomFeedbackFields = () => {
	// Simple validation functions
	const validateRating = (value: number | null | undefined) => {
		return !value ? 'Please select a rating before submitting' : undefined;
	};

	const validateProjectName = (value: string | undefined) => {
		if (!value || !value.trim()) {
			return 'Project name is required';
		}
		if (value.trim().length < 3) {
			return 'Project name must be at least 3 characters long';
		}
		return undefined;
	};

	return (
		<>
			<Field
				name="rating"
				id="rating"
				label="Rate your experience"
				isRequired
				validate={validateRating}
			>
				{({ fieldProps, error }) => (
					<>
						<Box paddingBlock="space.200">
							{/* Visually-hidden input acts as a focus target for final-form-focus when
							    the field is rendered with custom controls instead of a real <input>. */}
							<VisuallyHidden>
								<input
									type="text"
									id="rating"
									tabIndex={-1}
									readOnly
									aria-label="Rate your experience"
									aria-invalid={error ? true : undefined}
									aria-describedby={error ? 'rating-error' : undefined}
									value={fieldProps.value ?? ''}
									onChange={() => {}}
								/>
							</VisuallyHidden>
							<Inline space="space.100" alignBlock="center">
								{[
									{ value: 1, icon: ThumbsDownIcon, label: 'Thumbs down' },
									{ value: 2, icon: ThumbsUpIcon, label: 'Thumbs up' },
								].map((rating) => (
									<IconButton
										key={rating.value}
										icon={rating.icon}
										isSelected={fieldProps.value === rating.value}
										onClick={() => {
											// If the same rating is clicked again, deselect it
											if (fieldProps.value === rating.value) {
												fieldProps.onChange(null);
											} else {
												fieldProps.onChange(rating.value);
											}
										}}
										label={
											fieldProps.value === rating.value
												? `${rating.label} (selected, click to deselect)`
												: rating.label
										}
										testId={`rating-${rating.value}`}
									/>
								))}
							</Inline>
						</Box>
						{error && <ErrorMessage>{error}</ErrorMessage>}
					</>
				)}
			</Field>

			<Field
				name="projectName"
				id="projectName"
				label="Project Name"
				isRequired
				validate={validateProjectName}
			>
				{({ fieldProps, error }) => (
					<>
						<Box paddingBlock="space.200">
							<Textfield
								{...fieldProps}
								placeholder="Enter project name..."
								testId="project-name-input"
							/>
						</Box>
						{error && <ErrorMessage>{error}</ErrorMessage>}
					</>
				)}
			</Field>
		</>
	);
};

const DisplayFeedback = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [displayFlag, setDisplayFlag] = useState(false);

	const open = () => setIsOpen(true);
	const close = () => setIsOpen(false);

	const displayFlagTrue = () => setDisplayFlag(true);

	const hideFlag = () => setDisplayFlag(false);

	const submitForm = async (data: any) => {
		console.log('Submitting feedback form', data);
		// on success:
		displayFlagTrue();
		close();
	};

	return (
		<div>
			<Button appearance="primary" onClick={open}>
				Display Feedback Collector with Custom Validation
			</Button>

			{isOpen && (
				<FeedbackCollector
					entrypointId="example-custom-validation"
					locale={'en'}
					onClose={close}
					onSubmit={submitForm}
					showTypeField={true}
					showDefaultTextFields={true}
					customContent={<CustomFeedbackFields />}
				/>
			)}
			<FlagGroup onDismissed={hideFlag}>{displayFlag && <FeedbackFlag />}</FlagGroup>
		</div>
	);
};

export default (): React.JSX.Element => <DisplayFeedback />;
