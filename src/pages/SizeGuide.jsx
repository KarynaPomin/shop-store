import styles from "./SizeGuide.module.css";

export default function SizeGuide() {
  return (
    <div className={styles.guide}>
      <div className={styles.guideContent}>
        <h1>Size Guide</h1>

        <p className={styles.description}>
          Use this guide to find the best size for your clothes.
        </p>

        <div className={styles.tableWrapper}>
          <table className={styles.sizeTable}>
            <thead>
              <tr>
                <th>Size</th>
                <th>Chest (cm)</th>
                <th>Waist (cm)</th>
                <th>Hips (cm)</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>XS</td>
                <td>82-86</td>
                <td>64-68</td>
                <td>88-92</td>
              </tr>

              <tr>
                <td>S</td>
                <td>86-90</td>
                <td>68-72</td>
                <td>92-96</td>
              </tr>

              <tr>
                <td>M</td>
                <td>90-96</td>
                <td>72-78</td>
                <td>96-102</td>
              </tr>

              <tr>
                <td>L</td>
                <td>96-102</td>
                <td>78-84</td>
                <td>102-108</td>
              </tr>

              <tr>
                <td>XL</td>
                <td>102-108</td>
                <td>84-90</td>
                <td>108-114</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className={styles.measure}>
          <h2>How to measure</h2>

          <ul>
            <li>Chest: Measure around the fullest part of your chest.</li>
            <li>Waist: Measure around your natural waistline.</li>
            <li>Hips: Measure around the widest part of your hips.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
