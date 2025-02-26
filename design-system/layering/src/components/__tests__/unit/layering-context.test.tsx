import React, { useCallback, useState } from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Button from '@atlaskit/button/new';
import Modal, { ModalBody, ModalHeader } from '@atlaskit/modal-dialog';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';

import { Layering, useLayering } from '../../../index';

describe('Layering', () => {
	const Wrapper = () => {
		const { currentLevel, topLevelRef } = useLayering();
		return (
			<div>
				The current level is {currentLevel}, top level is {topLevelRef.current ?? 'null'}
			</div>
		);
	};

	it('should have default context value if Layering is not provided', () => {
		render(<Wrapper />);
		expect(screen.getByText(/^The current level is/)).toHaveTextContent(
			'The current level is 0, top level is null',
		);
	});

	it('should have correct context value if 2 layers are provided', () => {
		render(
			<Layering isDisabled={false}>
				<Layering isDisabled={false}>
					<Wrapper />
				</Layering>
			</Layering>,
		);
		expect(screen.getByText(/^The current level is/)).toHaveTextContent(
			'The current level is 2, top level is 2',
		);
	});

	it('should have correct context value if 4 layers are provided', () => {
		render(
			<Layering isDisabled={false}>
				<Layering isDisabled={false}>
					<Layering isDisabled={false}>
						<Layering isDisabled={false}>
							<Wrapper />
						</Layering>
					</Layering>
				</Layering>
			</Layering>,
		);
		expect(screen.getByText(/^The current level is/)).toHaveTextContent(
			'The current level is 4, top level is 4',
		);
	});

	it('should have default context value if isDisabled is true by default', () => {
		render(
			<Layering>
				<Wrapper />
			</Layering>,
		);
		expect(screen.getByText(/^The current level is/)).toHaveTextContent(
			'The current level is 0, top level is null',
		);
	});

	it('should set topLevel correctly when parent re-rendered', async () => {
		const ChildModal = ({ onCancel, onClose }: { onCancel: () => void; onClose: () => void }) => {
			return (
				<Modal width={400} onClose={onCancel} label="child modal">
					<ModalHeader>Are you sure?</ModalHeader>
					<ModalBody>
						<Button onClick={onCancel}>Whoops go back!!!</Button>
						<Button onClick={onClose}>Yep shut it all down!</Button>
					</ModalBody>
				</Modal>
			);
		};
		const NestedModals = () => {
			const [isParentOpen, setIsParentOpen] = useState(false);
			const [isChildOpen, setIsChildOpen] = useState(false);
			return (
				<>
					<Button
						onClick={() => {
							setIsParentOpen(true);
						}}
					>
						Open Modal
					</Button>
					{isParentOpen && (
						<Modal
							label="parent modal"
							onClose={() => {
								setIsChildOpen(true);
							}}
						>
							<ModalHeader>Primary Modal</ModalHeader>
							<ModalBody>
								{isChildOpen && (
									<ChildModal
										onCancel={() => {
											setIsChildOpen(false);
										}}
										onClose={() => {
											setIsChildOpen(false);
											setIsParentOpen(false);
										}}
									/>
								)}
							</ModalBody>
						</Modal>
					)}
				</>
			);
		};
		const user = await userEvent.setup();
		render(<NestedModals />);
		await user.click(
			screen.getByRole('button', {
				name: 'Open Modal',
			}),
		);
		expect(
			screen.getByRole('dialog', {
				name: 'parent modal',
			}),
		).toBeInTheDocument();

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(
			screen.getByRole('dialog', {
				name: 'child modal',
			}),
		).toBeInTheDocument();

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(
			screen.queryByRole('dialog', {
				name: 'child modal',
			}),
		).not.toBeInTheDocument();

		expect(
			screen.getByRole('dialog', {
				name: 'parent modal',
			}),
		).toBeInTheDocument();
	});

	describe('With FG', () => {
		beforeEach(() => {
			setBooleanFeatureFlagResolver((key: string) => key === 'plan_timeline_layering_wrapper');
		});

		const mockCallback = jest.fn();

		const WrapperFG = ({
			callback = mockCallback,
		}: {
			callback?: (currentLevel: number, topLevel: number | null) => void;
		}) => {
			const { currentLevel, topLevelRef } = useLayering();

			const onClick = useCallback(() => {
				callback(currentLevel, topLevelRef.current ?? null);
			}, [callback, currentLevel, topLevelRef]);

			return (
				<button type="button" onClick={onClick}>
					Get Layers
				</button>
			);
		};

		it('should have default context value if Layering is not provided', async () => {
			render(<WrapperFG />);
			await userEvent.click(screen.getByRole('button', { name: 'Get Layers' }));
			expect(mockCallback).toHaveBeenCalledWith(0, null);
		});

		it('should have correct context value if 2 layers are provided', async () => {
			render(
				<Layering isDisabled={false}>
					<Layering isDisabled={false}>
						<WrapperFG />
					</Layering>
				</Layering>,
			);
			await userEvent.click(screen.getByRole('button', { name: 'Get Layers' }));
			expect(mockCallback).toHaveBeenCalledWith(2, 2);
		});

		it('should have correct context value if 4 layers are provided', async () => {
			render(
				<Layering isDisabled={false}>
					<Layering isDisabled={false}>
						<Layering isDisabled={false}>
							<Layering isDisabled={false}>
								<WrapperFG />
							</Layering>
						</Layering>
					</Layering>
				</Layering>,
			);
			await userEvent.click(screen.getByRole('button', { name: 'Get Layers' }));
			expect(mockCallback).toHaveBeenCalledWith(4, 4);
		});

		it('should have default context value if isDisabled is true by default', async () => {
			render(
				<Layering>
					<WrapperFG />
				</Layering>,
			);
			await userEvent.click(screen.getByRole('button', { name: 'Get Layers' }));
			expect(mockCallback).toHaveBeenCalledWith(0, null);
		});

		it('should set topLevel correctly when parent re-rendered', async () => {
			const ChildModal = ({ onCancel, onClose }: { onCancel: () => void; onClose: () => void }) => {
				return (
					<Modal width={400} onClose={onCancel} label="child modal">
						<ModalHeader>Are you sure?</ModalHeader>
						<ModalBody>
							<Button onClick={onCancel}>Whoops go back!!!</Button>
							<Button onClick={onClose}>Yep shut it all down!</Button>
						</ModalBody>
					</Modal>
				);
			};
			const NestedModals = () => {
				const [isParentOpen, setIsParentOpen] = useState(false);
				const [isChildOpen, setIsChildOpen] = useState(false);
				return (
					<>
						<Button
							onClick={() => {
								setIsParentOpen(true);
							}}
						>
							Open Modal
						</Button>
						{isParentOpen && (
							<Modal
								label="parent modal"
								onClose={() => {
									setIsChildOpen(true);
								}}
							>
								<ModalHeader>Primary Modal</ModalHeader>
								<ModalBody>
									{isChildOpen && (
										<ChildModal
											onCancel={() => {
												setIsChildOpen(false);
											}}
											onClose={() => {
												setIsChildOpen(false);
												setIsParentOpen(false);
											}}
										/>
									)}
								</ModalBody>
							</Modal>
						)}
					</>
				);
			};
			const user = await userEvent.setup();
			render(<NestedModals />);
			await user.click(
				screen.getByRole('button', {
					name: 'Open Modal',
				}),
			);
			expect(
				screen.getByRole('dialog', {
					name: 'parent modal',
				}),
			).toBeInTheDocument();

			fireEvent.keyDown(document, { key: 'Escape' });

			expect(
				screen.getByRole('dialog', {
					name: 'child modal',
				}),
			).toBeInTheDocument();

			fireEvent.keyDown(document, { key: 'Escape' });

			expect(
				screen.queryByRole('dialog', {
					name: 'child modal',
				}),
			).not.toBeInTheDocument();

			expect(
				screen.getByRole('dialog', {
					name: 'parent modal',
				}),
			).toBeInTheDocument();
		});
	});
});
