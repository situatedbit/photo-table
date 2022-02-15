import { useState, FormEventHandler } from "react";

interface Props {
  onSubmit: (files: File[]) => void;
  onCancel: () => void;
}

export default function ImportFile({ onCancel, onSubmit }: Props) {
  const [files, setFiles] = useState<File[]>([]);

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    onSubmit(files);

    setFiles([]);
  };

  return (
    <form onSubmit={handleOnSubmit}>
      <input
        type="file"
        accept="image/*"
        multiple={true}
        onChange={({ target }) => setFiles(target.files ? [...target.files] : [])}
      />
      <input type="submit" value="Ok" />
      <input type="button" value="Cancel" onClick={onCancel} />
    </form>
  );
}
