import { useEffect } from 'react';

export default function Seo({ title, description }) {
  useEffect(() => {
    document.title = `${title} | Shop Store`;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && description) meta.setAttribute('content', description);
  }, [title, description]);

  return null;
}
