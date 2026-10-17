// Shared input state. Touch controls write here; the world scene reads it.
export const Input = {
  x: 0, y: 0,          // movement from the on-screen stick, -1..1
  action: false,       // set true on press; the world scene clears it after reading
  menu: false,
  blocked: 0,          // number of open menus or dialogues; the world pauses while > 0
  unblockedAt: 0       // when the last menu closed, so the closing key press isn't reused
};
function mark() { document.body.classList.toggle('ui-blocked', Input.blocked > 0); }
export function block() { Input.blocked++; Input.x = Input.y = 0; mark(); }
export function unblock() { Input.blocked = Math.max(0, Input.blocked - 1); Input.action = false; Input.unblockedAt = performance.now(); mark(); }
