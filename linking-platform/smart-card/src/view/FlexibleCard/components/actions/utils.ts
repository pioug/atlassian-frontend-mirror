export type BaseActionProps = { appearance?: 'default' | 'subtle' };
export const toActionProps = (
	props?: BaseActionProps,
): {
	appearance: 'default' | 'subtle';
	icon: undefined;
} => ({
	appearance: props?.appearance ?? 'default',
	icon: undefined,
});
