import React from 'react';

const CandidatesTally = ({ candidateJSON, positions }) => {
  positions.forEach(position => {
    position.count = 0;
  });

  candidateJSON.forEach(candidate => {
    const position = positions.find(position => {
      return position.PositionName === candidate.CandidatePosition;
    });
    position.count++;
  });

  const summary = positions.map(position => {
    return (
      <tr key={position.PositionName}>
        <th>{position.PositionName}</th>
        <th>
          {position.count} of {position.NumberNeeded}
        </th>
      </tr>
    );
  });

  return (
    <div className='table-responsive table-container'>
      <table className='table'>
        <thead />
        <tbody>{summary}</tbody>
      </table>
    </div>
  );
};

export default CandidatesTally;
