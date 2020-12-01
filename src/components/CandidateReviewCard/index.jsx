import React from 'react';
import { CMS_BASE_URL } from 'constants/baseURL';

const CandidateCard = ({ candidate, remove }) => {
  return (
    <div className='col-sm-3'>
      <div
        className='card'
        data-toggle='modal'
        data-target={`#candidate-${candidate.CandidateId}-modal`}
      >
        <img
          src={`${CMS_BASE_URL}/${candidate.Picture}`}
          className='card-img-top'
          alt={candidate.Name}
        />
        <div className='card-body'>
          <h5 className='card-title'>{candidate.Name}</h5>
          <h6 className='card-subtitle mb-2 text-muted'>
            {candidate.OrganizationName}
          </h6>
          <button className='btn' onClick={() => remove(candidate)}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
