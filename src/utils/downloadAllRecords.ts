import { buildClient } from "@datocms/cma-client-browser";

export default async function downloadAllRecords(apiToken: string) {
  const client = buildClient({
    apiToken,
  });

  const records = [];

  for await (const record of client.items.listPagedIterator()) {
    records.push(record);
  }

  const file = new Blob([JSON.stringify(records, null, 2)], {
    type: "application/json",
  });

  const element = document.createElement("a"); //there must be a better way to do this but i didn't find it
  element.href = URL.createObjectURL(file);
  element.download = "allDatocmsRecords" + new Date().toISOString() + ".json";
  document.body.appendChild(element);
  element.click();
}
