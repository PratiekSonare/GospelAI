interface FlowOptions {
  selector: string;
  char?: string;
  interval?: number;
  limit?: number;
  loop?: boolean;
}

export default function flow({
  selector,
  char = "w",
  interval = 500,
  limit = 30,
  loop = false
}: FlowOptions): void {
  const el = document.querySelector(selector);
  if (!el) {
    console.error(`Element not found: ${selector}`);
    return;
  }

  let count = 0;

  const run = () => {
    const id = setInterval(() => {
      el.textContent += char;
      count++;

      if (!loop && count >= limit) {
        clearInterval(id);
      }

      if (loop && count >= limit) {
        el.textContent = el.textContent!.replace(new RegExp(`${char}{${limit}}$`), "");
        count = 0;
      }
    }, interval);
  };

  run();
}
