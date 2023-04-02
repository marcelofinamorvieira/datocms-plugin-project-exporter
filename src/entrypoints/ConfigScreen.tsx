import { RenderConfigScreenCtx } from "datocms-plugin-sdk";
import { Button, Canvas, Spinner } from "datocms-react-ui";
import s from "./styles.module.css";
import { useState } from "react";
import downloadAllRecords from "../utils/downloadAllRecords";
import downloadAllAssets from "../utils/downloadAllAssets";

type Props = {
  ctx: RenderConfigScreenCtx;
};

export default function ConfigScreen({ ctx }: Props) {
  const [isLoading, setLoading] = useState(false);

  const handleAllRecords = async () => {
    setLoading(true);
    await downloadAllRecords(ctx.currentUserAccessToken as string);
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
        className={isLoading ? "" : s.hidden}
        style={{ height: "200px", position: "relative" }}
      >
        <Spinner size={48} placement="centered" />
      </div>
      <div className={!isLoading ? s.buttonList : s.hidden}>
        You can download a specific record from its sidebar
        <Button
          className={s.buttonItem}
          onClick={handleAllRecords}
          disabled={isLoading}
        >
          Download all records from this project
        </Button>
        <Button
          onClick={handleAllAssets}
          className={s.buttonItem}
          disabled={isLoading}
        >
          Download all assets from this project
        </Button>
      </div>
    </Canvas>
  );
}
