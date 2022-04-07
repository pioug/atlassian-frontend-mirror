// Few tests that are based on mouse hover are flakey.
// Calling this method to reset the mouse position before mouse hover fixes flakiness.
export const resetMousePosition = async (page: any) => {
  await page.mouse.move(10, 10);
};
