// See https://developer.mozilla.org/en-US/docs/Web/API/Prioritized_Task_Scheduling_API
async function taskYield() {
	// This is using globalThis to allow the yield task to be used outside of a browser env
	if (
		'scheduler' in globalThis &&
		// @ts-ignore
		'yield' in globalThis.scheduler
	) {
		// @ts-ignore
		await scheduler.yield();

		return;
	}
	let resolve = () => {};
	const p = new Promise<void>((a) => {
		resolve = a;
	});

	setTimeout(resolve, 0);

	await p;
}

export default taskYield;
