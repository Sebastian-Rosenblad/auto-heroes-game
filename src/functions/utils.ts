export function getID(IDs: Array<string>): string {
  let ID: string = Math.random().toString(16).slice(2,8);
  while (IDs.includes(ID)) ID = Math.random().toString(16).slice(2,8);
  return ID;
}
export function toCamelCase(text: string): string {
  return text.split(/[\s\-_]+/).map((word, index) =>
    index === 0 ? word.toLocaleLowerCase() : word[0].toLocaleUpperCase() + word.slice(1).toLocaleLowerCase()
  ).join("");
}
