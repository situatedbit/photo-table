import { ChangeEvent } from "react";

type Props = {
  onCenterOnOrigin: () => void;
  onImportFiles: (files: File[]) => void;
};

function Toolbar({ onCenterOnOrigin, onImportFiles }: Props) {
  const handleOnFilesChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    onImportFiles(target.files ? [...target.files] : []);
  };

  return (
    <div className="bg-slate-50 border-b-2 p-2">
      <form className="flex gap-2">
        <label
          className="bg-slate-200 border-2 p-1"
          htmlFor="c-toolbar-file"
        >
          🠅 Add Images
        </label>
        <input
          id="c-toolbar-file"
          className="opacity-0 w-0"
          type="file"
          accept="image/*"
          multiple={true}
          onChange={handleOnFilesChange}
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
    </div>
  );
}

export default Toolbar;
