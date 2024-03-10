export function toCamelCase(text: string): string {
  return text.split(/[\s\-_]+/).map((word, index) =>
    index === 0 ? word.toLocaleLowerCase() : word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
  ).join("");
}
