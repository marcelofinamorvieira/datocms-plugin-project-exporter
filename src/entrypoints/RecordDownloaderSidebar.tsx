import { RenderItemFormSidebarPanelCtx } from "datocms-plugin-sdk";
import { Button, Canvas } from "datocms-react-ui";

type PropTypes = {
  ctx: RenderItemFormSidebarPanelCtx;
};

export default function RecordDownloaderSidebar({ ctx }: PropTypes) {
  const downloadTxtFile = async () => {
    const file = new Blob([JSON.stringify(ctx.formValues, null, 2)], {
      type: "application/json",
    });

    const element = document.createElement("a");
    element.href = URL.createObjectURL(file);
    element.download = "datocmsRecord" + ctx.item!.id + ".json";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <Canvas ctx={ctx}>
      <Button onClick={downloadTxtFile}>Download this record</Button>
    </Canvas>
  );
}
