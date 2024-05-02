const AudioFeatures = ({ features }) => {
  return (
    <div>
      <h2>Audio Features</h2>
      <table>
        <tbody>
          {Object.keys(features).map(key => (
            <tr key={key}>
              <td style={{ fontWeight: 'bold' }}>{key}</td>
              <td>{features[key]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AudioFeatures;