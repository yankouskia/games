/**
 * Utility functions shared across the platform.
 */

/**
 * Shuffle an array in place (Fisher-Yates).
 * @param {Array} arr
 * @returns {Array} The same array, shuffled.
 */
export function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Pick n random unique elements from an array.
 * @param {Array} arr Source array
 * @param {number} n Number of items
 * @returns {Array} New array with n random items
 */
export function pickRandom(arr, n) {
  const copy = [...arr];
  shuffle(copy);
  return copy.slice(0, Math.min(n, copy.length));
}

/**
 * Create a DOM element with attributes and children.
 * @param {string} tag
 * @param {Object} attrs
 * @param  {...(string|Node)} children
 * @returns {HTMLElement}
 */
export function el(tag, attrs = {}, ...children) {
  const isSVG = ['svg', 'line', 'path', 'circle', 'rect', 'g'].includes(tag);
  const element = isSVG
    ? document.createElementNS('http://www.w3.org/2000/svg', tag)
    : document.createElement(tag);

  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'className') {
      if (isSVG) element.setAttribute('class', value);
      else element.className = value;
    } else if (key === 'style' && typeof value === 'object') {
      Object.assign(element.style, value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const event = key.slice(2).toLowerCase();
      element.addEventListener(event, value);
    } else {
      element.setAttribute(key, value);
    }
  }

  for (const child of children) {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      element.appendChild(child);
    }
  }

  return element;
}

/**
 * Get center position of an element relative to a container.
 */
export function getCenter(element, container) {
  const er = element.getBoundingClientRect();
  const cr = container.getBoundingClientRect();
  return {
    x: er.left - cr.left + er.width / 2,
    y: er.top - cr.top + er.height / 2,
  };
}

/**
 * Delay helper.
 * @param {number} ms
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
