import React from 'react';

import { fireEvent, queryByAttribute, render, screen } from '@testing-library/react';

import noop from '@atlaskit/ds-lib/noop';
import CheckCircleIcon from '@atlaskit/icon/glyph/check-circle';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import InfoIcon from '@atlaskit/icon/glyph/info';
import JiraLabsIcon from '@atlaskit/icon/glyph/jira/labs';
import QuestionCircleIcon from '@atlaskit/icon/glyph/question-circle';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Text } from '@atlaskit/primitives/compiled';
import { ffTest } from '@atlassian/feature-flags-test-utils';

import SectionMessage, { SectionMessageAction } from '../../index';
import { type Appearance } from '../../types';

const appearances: [Appearance, ({}) => JSX.Element][] = [
	['information', (props: {}) => <InfoIcon {...props} label="information" />],
	['warning', (props: {}) => <WarningIcon {...props} label="warning" />],
	['error', (props: {}) => <ErrorIcon {...props} label="error" />],
	['success', (props: {}) => <CheckCircleIcon {...props} label="success" />],
	['discovery', (props: {}) => <QuestionCircleIcon {...props} label="discovery" />],
];

const CustomLinkComponent = React.forwardRef((props = {}, ref: React.Ref<HTMLButtonElement>) => (
	// eslint-disable-next-line react/button-has-type
	<button {...props} ref={ref}>
		hello world
	</button>
));

const getByHref = queryByAttribute.bind(null, 'href');

describe('SectionMessage', () => {
	it('should render correct defaults', () => {
		render(<SectionMessage>boo</SectionMessage>);

		expect(screen.getByText('boo')).toBeInTheDocument();
	});

	it('should render both <Title /> and children if there is a title', () => {
		render(<SectionMessage title="things">boo</SectionMessage>);

		expect(screen.getByText('things')).toBeInTheDocument();
		expect(screen.getByText('boo')).toBeInTheDocument();
	});

	it('should render a custom icon and label if one is given', () => {
		const CustomIcon = () => <JiraLabsIcon label="some label" testId="custom-icon" />;
		render(
			<SectionMessage title="things" icon={CustomIcon}>
				boo
			</SectionMessage>,
		);

		const foundIcon = screen.getByTestId('custom-icon');
		expect(foundIcon).toBeInTheDocument();
		expect(foundIcon).toHaveAccessibleName('some label');
	});

	describe('actions', () => {
		it('should render actions beneath the section message description', () => {
			const actions = [
				<SectionMessageAction>
					<Text>aye</Text>
				</SectionMessageAction>,
				<SectionMessageAction>
					<Text>aye</Text>
				</SectionMessageAction>,
			];
			render(<SectionMessage actions={actions}>boo</SectionMessage>);

			expect(screen.getAllByText('aye')).toHaveLength(2);
			expect(screen.getAllByText('·')).toHaveLength(1);
		});

		it('should render React Nodes as actions', () => {
			const MyAction = () => <Text>Hello, World!</Text>;
			const Aye = (
				<SectionMessageAction>
					<MyAction />
				</SectionMessageAction>
			);
			render(<SectionMessage actions={[Aye]}>boo</SectionMessage>);

			expect(screen.getByText('Hello, World!')).toBeInTheDocument();
		});

		it('should render actions separated by dividers when passed in a Fragment', () => {
			const actions = (
				<>
					<SectionMessageAction>
						<Text>aye</Text>
					</SectionMessageAction>
					<SectionMessageAction>
						<Text>aye</Text>
					</SectionMessageAction>
				</>
			);
			render(
				<SectionMessage testId="a" actions={actions}>
					boo
				</SectionMessage>,
			);

			expect(screen.getAllByText('aye')).toHaveLength(2);
			expect(screen.getAllByText('·')).toHaveLength(1);
		});

		describe('should render a link when passed a `href`', () => {
			ffTest(
				'platform_section_message_action_migration',
				() => {
					render(
						<SectionMessage
							actions={
								<SectionMessageAction href="https://atlaskit.atlassian.com/" testId="action">
									Foo
								</SectionMessageAction>
							}
						>
							Bar
						</SectionMessage>,
					);

					expect(screen.getByTestId('action')).toBeInstanceOf(HTMLAnchorElement);
				},
				() => {
					const { container } = render(
						<SectionMessage
							actions={
								<SectionMessageAction href="https://atlaskit.atlassian.com/">
									aye
								</SectionMessageAction>
							}
						>
							boo
						</SectionMessage>,
					);

					expect(getByHref(container, 'https://atlaskit.atlassian.com/')?.textContent).toBe('aye');
				},
			);
		});

		describe('should render a link when passed both a `href` and `onClick`', () => {
			ffTest(
				'platform_section_message_action_migration',
				() => {
					render(
						<SectionMessage
							actions={
								<SectionMessageAction
									onClick={noop}
									href="https://atlaskit.atlassian.com/"
									testId="action"
								>
									Foo
								</SectionMessageAction>
							}
						>
							Bar
						</SectionMessage>,
					);

					expect(screen.getByTestId('action')).toBeInstanceOf(HTMLAnchorElement);
				},
				() => {
					render(
						<SectionMessage
							actions={
								<SectionMessageAction
									onClick={noop}
									href="https://atlaskit.atlassian.com/"
									testId="action"
								>
									Foo
								</SectionMessageAction>
							}
						>
							Bar
						</SectionMessage>,
					);

					expect(screen.getByTestId('action')).toBeInstanceOf(HTMLAnchorElement);
				},
			);
		});

		describe('should render a button when passed a `onClick` with no `href`', () => {
			ffTest(
				'platform_section_message_action_migration',
				() => {
					render(
						<SectionMessage
							actions={
								<SectionMessageAction onClick={noop} testId="action">
									Foo
								</SectionMessageAction>
							}
						>
							Bar
						</SectionMessage>,
					);

					expect(screen.getByTestId('action')).toBeInstanceOf(HTMLButtonElement);
				},
				() => {
					render(
						<SectionMessage
							actions={
								<SectionMessageAction onClick={noop} testId="action">
									Foo
								</SectionMessageAction>
							}
						>
							Bar
						</SectionMessage>,
					);

					expect(screen.getByTestId('action')).toBeInstanceOf(HTMLButtonElement);
				},
			);
		});

		it('should render a custom component when an action with href is passed', () => {
			const { container } = render(
				<SectionMessage
					actions={
						<SectionMessageAction
							href="https://atlaskit.atlassian.com/"
							linkComponent={CustomLinkComponent}
						>
							aye
						</SectionMessageAction>
					}
				>
					boo
				</SectionMessage>,
			);

			expect(getByHref(container, 'https://atlaskit.atlassian.com/')?.textContent).toBe(
				'hello world',
			);
		});

		it('should call "onClick" on the click of an action with "onClick" but no "href"', () => {
			const onClick = jest.fn();
			const action = <SectionMessageAction onClick={onClick}>aye</SectionMessageAction>;
			render(<SectionMessage actions={[action]}>boo</SectionMessage>);
			const sectionMsgAction = screen.getByText('aye');
			fireEvent.click(sectionMsgAction);

			expect(onClick).toHaveBeenCalledTimes(1);
		});

		it('should NOT render custom component for an action with onClick but no href', () => {
			const onClick = jest.fn();
			const action = (
				<SectionMessageAction onClick={onClick} linkComponent={CustomLinkComponent}>
					aye
				</SectionMessageAction>
			);
			render(<SectionMessage actions={[action]}>boo</SectionMessage>);
			const sectionMsgAction = screen.queryAllByText('hello world');

			expect(sectionMsgAction).toHaveLength(0);
		});

		it('should NOT render custom component for action with no onClick and no href', () => {
			const action = (
				<SectionMessageAction linkComponent={CustomLinkComponent}>aye</SectionMessageAction>
			);
			render(<SectionMessage actions={[action]}>boo</SectionMessage>);
			const sectionMsgAction = screen.queryAllByText('hello world');

			expect(sectionMsgAction).toHaveLength(0);
		});
	});

	test.each(appearances)('appearance: %p', (name, icon) => {
		render(
			<SectionMessage icon={icon} appearance={name}>
				boo
			</SectionMessage>,
		);

		const foundIcon = screen.getByLabelText(name);

		expect(foundIcon).toBeInTheDocument();
		expect(foundIcon).toHaveAccessibleName(name);

		const svgs = screen.getAllByRole('presentation');
		expect(svgs).toHaveLength(1);
		expect(svgs[0].tagName).toBe('svg');
	});
});
