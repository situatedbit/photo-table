import { useState } from 'react';

type Props = {
  onAddUrl: (url: string) => void,
};

function Toolbar({ onAddUrl }: Props) {
  const [urlValue, setUrlValue] = useState('');

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    onAddUrl(urlValue);

    setUrlValue('');
  }

  return (
    <div className="bg-slate-50 border-b-2 p-2">
      <form onSubmit={handleSubmit}>
        <input
          className="bg-slate-100 border-slate-200 border-2 p-1 mr-2"
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
      </form>
    </div>
  );
}

export default Toolbar;
