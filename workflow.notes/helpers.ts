export type AlfredListItem = {
  title: string;
  subtitle?: string;
  arg?: string;
  variables: {
    action?: string;
    noteFilePath: string;
  };
};

export function outputAlfredItems(
  items: AlfredListItem[],
  additionals: Record<string, unknown> = {}
) {
  console.log(
    JSON.stringify({
      ...additionals,
      items,
    })
  );
}
