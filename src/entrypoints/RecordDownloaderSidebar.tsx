import { RenderItemFormSidebarPanelCtx } from 'datocms-plugin-sdk';
import { Button, Canvas } from 'datocms-react-ui';
import { json2csv } from 'json-2-csv';
import jsontoxml from 'jsontoxml';

type PropTypes = {
  ctx: RenderItemFormSidebarPanelCtx;
};

export default function RecordDownloaderSidebar({ ctx }: PropTypes) {
  const downloadTxtFile = async () => {
    if (!ctx.item) {
      ctx.alert('Save the record before trying to download it!');
      return;
    }

    const recordValue = ctx.item;

    switch (ctx.plugin.attributes.parameters.format || 'JSON') {
      case 'JSON':
        const file = new Blob([JSON.stringify(recordValue, null, 2)], {
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
        const csv = json2csv([recordValue]);
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
        const xml = jsontoxml(recordValue);
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
  };

  return (
    <Canvas ctx={ctx}>
      <Button onClick={downloadTxtFile}>Download this record</Button>
    </Canvas>
  );
}
