/* Local stand-in for a tag manager container: evaluates a list of tags synchronously, sends nothing. */
(function () {
  function spin(ms) {
    const end = performance.now() + ms;
    while (performance.now() < end);
  }

  const tags = Array.from({ length: 12 }, (_, index) => ({ id: `tag-${index + 1}`, cost: 9 }));
  const fired = [];

  tags.forEach((tag) => {
    spin(tag.cost);
    fired.push(tag.id);
  });

  window.vendorTagManager = { fired };
})();
