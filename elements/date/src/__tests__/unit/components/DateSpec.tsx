import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Date } from '../../../components/Date';
import { type DateProps } from '../../../';
import { ffTest } from '@atlassian/feature-flags-test-utils';

describe('Date', () => {
	const renderDate = (props: Partial<DateProps> = {}) =>
		render(<Date value={586137600000} {...props} />);

	const getText = () => screen.getByRole('button').textContent;

	describe('format', () => {
		ffTest.on('platform_editor_css_migrate_stage_1', 'with fg on', () => {
			it('should render date formated', () => {
				renderDate();
				expect(getText()).toEqual('29/07/1988');
			});

			it('should use custom format', () => {
				renderDate({ format: 'MM/dd/yyyy' });
				expect(getText()).toEqual('07/29/1988');
			});
		});

		ffTest.off('platform_editor_css_migrate_stage_1', 'with fg off', () => {
			it('should render date formated', () => {
				renderDate();
				expect(getText()).toEqual('29/07/1988');
			});

			it('should use custom format', () => {
				renderDate({ format: 'MM/dd/yyyy' });
				expect(getText()).toEqual('07/29/1988');
			});
		});
	});

	describe('color', () => {
		ffTest.on('platform_editor_css_migrate_stage_1', 'with fg on', () => {
			it('should use default color', () => {
				renderDate();
				expect(screen.getByRole('button')).toHaveCompiledCss('color', 'var(--ds-text,#172b4d)');
			});

			it('should set custom color', () => {
				renderDate({ color: 'red' });
				expect(screen.getByRole('button')).toHaveCompiledCss(
					'color',
					'var(--ds-text-accent-red,#ae2e24)',
				);
			});
		});

		ffTest.off('platform_editor_css_migrate_stage_1', 'with fg off', () => {
			it('should use default color', () => {
				renderDate();
				expect(screen.getByRole('button')).toHaveStyleDeclaration(
					'color',
					'var(--ds-text, #172B4D)',
				);
			});

			it('should set custom color', () => {
				renderDate({ color: 'red' });
				expect(screen.getByRole('button')).toHaveStyleDeclaration(
					'color',
					'var(--ds-text-accent-red, #AE2E24)',
				);
			});
		});
	});

	// current implementation actually does not support className
	describe('className', () => {
		ffTest.on('platform_editor_css_migrate_stage_1', 'with fg on', () => {
			it('should set className', () => {
				renderDate({ className: 'custom-class' });
				expect(screen.getByRole('button')).toHaveClass('custom-class');
			});
		});
	});

	// current implementation actually does not support onClick
	describe('onClick', () => {
		ffTest.on('platform_editor_css_migrate_stage_1', 'with fg on', () => {
			it('should set onClick', async () => {
				const user = userEvent.setup();
				const onClick = jest.fn();
				renderDate({ onClick });
				await user.click(screen.getByRole('button'));
				expect(onClick).toHaveBeenCalledTimes(1);
				expect(onClick).toHaveBeenCalledWith(586137600000, expect.anything());
			});
		});
	});

	describe('children', () => {
		ffTest.on('platform_editor_css_migrate_stage_1', 'with fg on', () => {
			it('should be formated value', () => {
				renderDate();
				expect(getText()).toEqual('29/07/1988');
			});

			it('should be children property', () => {
				renderDate({ children: '29 - 07 - 1988' });
				expect(getText()).toEqual('29 - 07 - 1988');
			});

			it('should be children property', () => {
				const children = jest.fn();
				children.mockReturnValueOnce('[29|07|1988]');
				renderDate({ children });
				expect(getText()).toEqual('[29|07|1988]');
			});
		});

		ffTest.off('platform_editor_css_migrate_stage_1', 'with fg off', () => {
			it('should be formated value', () => {
				renderDate();
				expect(getText()).toEqual('29/07/1988');
			});

			it('should be children property', () => {
				renderDate({ children: '29 - 07 - 1988' });
				expect(getText()).toEqual('29 - 07 - 1988');
			});

			it('should be children property', () => {
				const children = jest.fn();
				children.mockReturnValueOnce('[29|07|1988]');
				renderDate({ children });
				expect(getText()).toEqual('[29|07|1988]');
			});
		});
	});
});
