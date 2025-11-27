// typewriterAppend.js

export default function flow({
  selector,
  char = "w",
  interval = 500,
  limit = 30,       // optional: stops after N characters
  loop = false      // optional: loops animation if true
}) {
  const el = document.querySelector(selector);
  if (!el) return console.error(`Element not found: ${selector}`);

  let count = 0;

  const run = () => {
    const id = setInterval(() => {
      el.textContent += char;
      count++;

      if (!loop && count >= limit) {
        clearInterval(id);
      }

      if (loop && count >= limit) {
        el.textContent = el.textContent.replace(new RegExp(`${char}{${limit}}$`), "");
        count = 0;
      }
    }, interval);
  };

  run();
}
