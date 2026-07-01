import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';

export default function About() {
  return (
    <Page className="content-page">
      <Seo title="About" description="About Shop Store portfolio e-commerce concept." />
      <h1>About Shop Store</h1>
      <p>
        Shop Store is a portfolio e-commerce concept built to feel like a real fashion retailer:
        editorial visuals, reusable architecture, mock commerce data and flows ready for a backend.
      </p>
      <p>
        The current version focuses on browsing, product discovery, cart, checkout architecture,
        account surfaces and an admin foundation for catalog operations.
      </p>
    </Page>
  );
}
