import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';

export default function Confirmation() {
  return (
    <Page className="state-page">
      <Seo title="Order confirmed" description="Order confirmation page." />
      <CheckCircleOutlineIcon />
      <h1>Order confirmed</h1>
      <p>Your frontend checkout flow is complete and ready to connect to a real payment provider later.</p>
      <Link className="button buttonDark" to="/">Back to shop</Link>
    </Page>
  );
}
