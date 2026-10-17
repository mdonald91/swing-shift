// Tiny event bus so the Phaser world and the HTML interface can talk to each other.
const handlers = {};
export const bus = {
  on(evt, fn) { (handlers[evt] ||= []).push(fn); return () => bus.off(evt, fn); },
  once(evt, fn) { const w = (...a) => { bus.off(evt, w); fn(...a); }; return bus.on(evt, w); },
  off(evt, fn) { handlers[evt] = (handlers[evt] || []).filter(f => f !== fn); },
  emit(evt, ...args) { (handlers[evt] || []).slice().forEach(f => f(...args)); }
};
