import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import { Button, Canvas, SelectField, Spinner } from 'datocms-react-ui';
import s from './styles.module.css';
import { useEffect, useState } from 'react';
import downloadAllRecords from '../utils/downloadAllRecords';
import downloadAllAssets from '../utils/downloadAllAssets';
import { buildClient } from '@datocms/cma-client-browser';

type Props = {
  ctx: RenderConfigScreenCtx;
};

type ModelObject = {
  name: string;
  id: string;
};

export default function ConfigScreen({ ctx }: Props) {
  const [isLoading, setLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState<ModelObject[]>([]);
  const [allModels, setAllModels] = useState<ModelObject[]>([]);

  useEffect(() => {
    const client = buildClient({
      apiToken: ctx.currentUserAccessToken!,
    });

    client.itemTypes.list().then((models) => {
      setAllModels(
        models
          .filter((model) => !model.modular_block)
          .map((model) => {
            return { name: model.name, id: model.id };
          })
      );
    });
  }, []);

  const handleAllRecords = async () => {
    setLoading(true);
    await downloadAllRecords(ctx.currentUserAccessToken as string);
    setLoading(false);
  };

  const handleSelectedRecords = async () => {
    setLoading(true);
    await downloadAllRecords(
      ctx.currentUserAccessToken as string,
      selectedModels.map((model) => model.id)
    );
    setLoading(false);
  };

  const handleAllAssets = async () => {
    setLoading(true);

    await downloadAllAssets(ctx.currentUserAccessToken as string);

    setLoading(false);
  };

  return (
    <Canvas ctx={ctx}>
      <div
        className={isLoading ? '' : s.hidden}
        style={{ height: '200px', position: 'relative' }}
      >
        <Spinner size={48} placement="centered" />
      </div>
      <div className={!isLoading ? s.buttonList : s.hidden}>
        <div style={{ textAlign: 'center' }}>
          You can download a specific record from its sidebar
        </div>
        <Button
          className={s.buttonItem}
          onClick={handleAllRecords}
          disabled={isLoading}
        >
          Download all records from this project
        </Button>

        <div className={s.modelSelectorContainer}>
          <div className={s.modelSelector}>
            <SelectField
              name="multipleOption"
              id="multipleOption"
              label=""
              placeholder="Select models to download records from"
              value={selectedModels.map((model) => {
                return { label: model.name, value: model.id };
              })}
              selectInputProps={{
                isMulti: true,
                options: allModels.map((model) => {
                  return { label: model.name, value: model.id };
                }),
              }}
              onChange={(newValue) =>
                setSelectedModels(
                  newValue.map((model) => {
                    return { name: model.label, id: model.value };
                  })
                )
              }
            />
          </div>

          <Button
            disabled={!selectedModels.length}
            onClick={handleSelectedRecords}
            fullWidth
          >
            Download from selected models
          </Button>
        </div>
        <Button
          onClick={handleAllAssets}
          className={s.buttonItem + ' ' + s.assetItem}
          disabled={isLoading}
        >
          Download all assets from this project
        </Button>
        <div className={s.tooltipBox}>
          <span className={s.tooltipSpan}>
            Keep in mind that for projects with too many records this button
            will not work, instead, use the script specified here:{' '}
            <a
              href="https://www.datocms.com/docs/import-and-export/export-data"
              target="_blank"
              rel="noreferrer"
              style={{
                color: '#0077cc',
                textDecoration: 'none',
              }}
            >
              https://www.datocms.com/docs/import-and-export/export-data
            </a>
          </span>
        </div>
      </div>
    </Canvas>
  );
}
