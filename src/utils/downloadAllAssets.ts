import { buildClient } from "@datocms/cma-client-browser";
import JSZip from "jszip";

export default async function downloadAllAssets(apiToken: string) {
  const client = buildClient({
    apiToken,
  });

  const zip = new JSZip();

  for await (const upload of client.uploads.listPagedIterator()) {
    console.log(upload);
    const request = await fetch(upload.url);

    const file = await request.blob();

    zip.file(upload.filename, file);
  }

  const finishedZip = await zip.generateAsync({ type: "blob" });

  const element = document.createElement("a"); //there must be a better way to do this but i didn't find it
  element.href = URL.createObjectURL(finishedZip);
  element.download = "allAssets.zip";
  document.body.appendChild(element);
  element.click();
}
