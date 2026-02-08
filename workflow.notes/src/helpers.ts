import { type AlfredListItem } from './sfItems';

export function outputAlfredItems(
  items: AlfredListItem[],
  additionals: Record<string, any> = {}
) {
  console.log(
    JSON.stringify({
      ...additionals,

      items,
    })
  );
}
