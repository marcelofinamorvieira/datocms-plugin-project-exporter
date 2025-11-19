import { buildClient, SimpleSchemaTypes } from '@datocms/cma-client-browser';
import { AvailableFormats } from '../entrypoints/ConfigScreen';
import downloadRecordsFile from './downloadRecordsFile';

type Options = {
  modelIDs?: string[];
  textQuery?: string;
};

export default async function downloadAllRecords(
  apiToken: string,
  format: AvailableFormats,
  options: Options
) {
  const client = buildClient({
    apiToken,
  });

  const records = [];

  const filterObject: SimpleSchemaTypes.ItemInstancesHrefSchema = {};

  filterObject.filter = {
    ...(options.modelIDs && { type: options.modelIDs.join(',') }),
    ...(options.textQuery && { query: options.textQuery }),
  };

  for await (const record of client.items.listPagedIterator(filterObject)) {
    records.push(record);
  }

  if (format === 'JSON') {
    const itemTypes = await client.itemTypes.list();
    const fields = (
      await Promise.all(itemTypes.map((model) => client.fields.list(model.id)))
    ).flat();

    downloadRecordsFile({ records, schema: { itemTypes, fields } }, format);
  } else {
    downloadRecordsFile(records, format);
  }
}
