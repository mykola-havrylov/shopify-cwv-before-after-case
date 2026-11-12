/* Local stand-in for a tag manager container: evaluates a list of tags, one task per tag, sends nothing. */
(function () {
  function spin(ms) {
    const end = performance.now() + ms;
    while (performance.now() < end);
  }

  function yieldToMain() {
    if (globalThis.scheduler?.yield) return globalThis.scheduler.yield();
    return new Promise((resolve) => setTimeout(resolve, 0));
  }

  const tags = Array.from({ length: 12 }, (_, index) => ({ id: `tag-${index + 1}`, cost: 9 }));
  const fired = [];

  window.vendorTagManager = { fired };

  (async function fireTags() {
    for (const tag of tags) {
      spin(tag.cost);
      fired.push(tag.id);
      await yieldToMain();
    }
  })();
})();
