import { useState, ChangeEvent, FormEventHandler } from "react";
import ImportFile from "@/components/ImportFile";

type Props = {
  onAddUrl: (url: string) => void;
  onCenterOnOrigin: () => void;
  onImportFiles: (files: File[]) => void;
};

function Toolbar({ onAddUrl, onCenterOnOrigin, onImportFiles }: Props) {
  const [isImportFileVisible, setIsImportFileVisible] = useState(false);
  const [urlValue, setUrlValue] = useState("");

  const importFileButton = (
    <button
      className="bg-slate-200 border-2 p-1"
      type="button"
      onClick={() => setIsImportFileVisible(true)}
    >
      Add Files
    </button>
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    onAddUrl(urlValue);

    setUrlValue("");
  };

  const handleOnSubmitFiles = (files: File[]) => {
    onImportFiles(files);
    setIsImportFileVisible(false);
  };

  return (
    <div className="bg-slate-50 border-b-2 p-2">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <input
          className="bg-slate-100 border-slate-200 border-2 p-1"
          type="url"
          placeholder="Image URL"
          value={urlValue}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setUrlValue(event.target.value)
          }
        />
        <input
          className="bg-slate-200 border-2 p-1"
          type="submit"
          value="Add Image"
        />
        <button
          className="bg-slate-200 border-2 p-1"
          onClick={onCenterOnOrigin}
          title="Return to center"
          type="button"
        >
          🞕
        </button>
      </form>
      {isImportFileVisible ? (
        <ImportFile
          onCancel={() => setIsImportFileVisible(false)}
          onSubmit={handleOnSubmitFiles}
        />
      ) : (
        importFileButton
      )}
    </div>
  );
}

export default Toolbar;
