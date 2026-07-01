import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';

export default function Contact() {
  return (
    <Page className="content-page">
      <Seo title="Contact" description="Contact Shop Store support." />
      <h1>Contact Us</h1>
      <form className="contact-form">
        <label>Name<input /></label>
        <label>Email<input type="email" /></label>
        <label>Message<textarea rows="6" /></label>
        <button className="button buttonDark" type="button">Send message</button>
      </form>
    </Page>
  );
}
