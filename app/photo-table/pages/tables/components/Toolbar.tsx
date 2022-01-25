import { useState } from 'react';

type Props = {
  onAddUrl: (url: string) => void,
  onCenterOnOrigin: () => void,
};

function Toolbar({ onAddUrl, onCenterOnOrigin }: Props) {
  const [urlValue, setUrlValue] = useState('');

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    onAddUrl(urlValue);

    setUrlValue('');
  }

  return (
    <div className="bg-slate-50 border-b-2 p-2">
      <form
        className="flex gap-2"
        onSubmit={handleSubmit}
      >
        <input
          className="bg-slate-100 border-slate-200 border-2 p-1"
          type="url"
          placeholder="Image URL"
          value={urlValue}
          onChange={(event: Event) => setUrlValue(event.target.value)}
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
    </div>
  );
}

export default Toolbar;
