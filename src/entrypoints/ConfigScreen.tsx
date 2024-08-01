import { RenderConfigScreenCtx } from 'datocms-plugin-sdk';
import {
  Button,
  Canvas,
  CaretDownIcon,
  CaretUpIcon,
  Dropdown,
  DropdownMenu,
  DropdownOption,
  DropdownSeparator,
  SelectField,
  Spinner,
} from 'datocms-react-ui';
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

export type AvailableFormats = 'JSON' | 'CSV' | 'XML';

export default function ConfigScreen({ ctx }: Props) {
  const [isLoading, setLoading] = useState(false);
  const [selectedModels, setSelectedModels] = useState<ModelObject[]>([]);
  const [allModels, setAllModels] = useState<ModelObject[]>([]);
  const [selectedFormat, setSelectedFormat] = useState<AvailableFormats>(
    (ctx.plugin.attributes.parameters.format as AvailableFormats) ?? 'JSON'
  );

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
    await downloadAllRecords(
      ctx.currentUserAccessToken as string,
      selectedFormat
    );
    setLoading(false);
  };

  const handleSelectedRecords = async () => {
    setLoading(true);
    await downloadAllRecords(
      ctx.currentUserAccessToken as string,
      selectedFormat,
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
        <div
          style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center',
            marginBottom: '20px',
            textAlign: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontSize: '16px' }}>Format for exports</span>
          <Dropdown
            renderTrigger={({ open, onClick }) => (
              <Button
                onClick={onClick}
                rightIcon={open ? <CaretUpIcon /> : <CaretDownIcon />}
              >
                {selectedFormat}
              </Button>
            )}
          >
            <DropdownMenu>
              <DropdownOption
                onClick={() => {
                  setSelectedFormat('JSON');
                  ctx
                    .updatePluginParameters({
                      format: 'JSON',
                    })
                    .then(() => {
                      ctx.notice('Format for exports updated');
                    });
                }}
              >
                JSON
              </DropdownOption>
              <DropdownOption
                onClick={() => {
                  setSelectedFormat('CSV');
                  ctx
                    .updatePluginParameters({
                      format: 'CSV',
                    })
                    .then(() => {
                      ctx.notice('Format for exports updated');
                    });
                }}
              >
                CSV
              </DropdownOption>
              <DropdownOption
                onClick={() => {
                  setSelectedFormat('XML');
                  ctx
                    .updatePluginParameters({
                      format: 'XML',
                    })
                    .then(() => {
                      ctx.notice('Format for exports updated');
                    });
                }}
              >
                XML
              </DropdownOption>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className={s.tooltipBox} style={{ textAlign: 'center' }}>
          You can download a specific record from its own sidebar
        </div>
        <div
          style={{
            width: '100%',
            height: '1px',
            backgroundColor: '#e0e0e0',
            margin: '20px 0',
          }}
        />
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
