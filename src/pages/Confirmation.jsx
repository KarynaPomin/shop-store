import { Link } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import { currency } from '../utils/format.js';

export default function Confirmation() {
  let order = null;

  try {
    order = JSON.parse(localStorage.getItem('shop-last-order'));
  } catch {
    order = null;
  }

  return (
    <Page className="state-page">
      <Seo title="Order confirmed" description="Order confirmation page." />
      <CheckCircleOutlineIcon />
      <h1>Order confirmed</h1>
      {order ? (
        <p>
          {order.type === 'guest' ? 'Guest order' : 'Account order'} {order.id} was placed for {order.email}.
          Total: {currency(order.total)}.
        </p>
      ) : (
        <p>Your frontend checkout flow is complete and ready to connect to a real payment provider later.</p>
      )}
      <Link className="button buttonDark" to="/">Back to shop</Link>
    </Page>
  );
}
