import { useState } from 'react';

type Props = {
  onAddUrl: (url: string) => void,
};

function TableBar({ onAddUrl }: Props) {
  const [urlValue, setUrlValue] = useState('');

  const handleSubmit = (event: Event) => {
    event.preventDefault();
    onAddUrl(urlValue);

    setUrlValue('');
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Image URL"
          value={urlValue}
          onChange={(event: Event) => setUrlValue(event.target.value)}
        />
        <input type="submit" value="Add Image" />
      </form>
    </div>
  );
}

export default TableBar;