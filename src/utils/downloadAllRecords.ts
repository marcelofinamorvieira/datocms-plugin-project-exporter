import { buildClient } from '@datocms/cma-client-browser';
import { AvailableFormats } from '../entrypoints/ConfigScreen';
import { json2csv } from 'json-2-csv';
import jsontoxml from 'jsontoxml';

export default async function downloadAllRecords(
  apiToken: string,
  format: AvailableFormats,
  modelIDs?: string[]
) {
  const client = buildClient({
    apiToken,
  });

  const records = [];

  if (modelIDs) {
    for await (const record of client.items.listPagedIterator({
      filter: {
        type: modelIDs.join(','),
      },
    })) {
      records.push(record);
    }
  } else {
    for await (const record of client.items.listPagedIterator({
      nested: 'true',
    })) {
      records.push(record);
    }
  }
  switch (format) {
    case 'JSON':
      const file = new Blob([JSON.stringify(records, null, 2)], {
        type: 'application/json',
      });

      const element = document.createElement('a'); //there must be a better way to do this but i didn't find it
      element.href = URL.createObjectURL(file);
      element.download =
        'allDatocmsRecords' + new Date().toISOString() + '.json';
      document.body.appendChild(element);
      element.click();
      break;
    case 'CSV':
      const csv = json2csv(records);
      const csvFile = new Blob([csv], {
        type: 'text/csv',
      });
      const csvElement = document.createElement('a');
      csvElement.href = URL.createObjectURL(csvFile);
      csvElement.download =
        'allDatocmsRecords' + new Date().toISOString() + '.csv';
      document.body.appendChild(csvElement);
      csvElement.click();
      break;
    case 'XML':
      const xml = jsontoxml(records);
      const xmlFile = new Blob([xml], {
        type: 'application/xml',
      });
      const xmlElement = document.createElement('a');
      xmlElement.href = URL.createObjectURL(xmlFile);
      xmlElement.download =
        'allDatocmsRecords' + new Date().toISOString() + '.xml';
      document.body.appendChild(xmlElement);
      xmlElement.click();
      break;
  }
}
