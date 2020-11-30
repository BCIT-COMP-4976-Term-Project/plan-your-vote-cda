import React from 'react';
import { CMS_BASE_URL } from 'constants/baseURL';
import './style.css';

const CandidateCard = ({ candidate, displayModal }) => {
  return (
    <div className='col-sm-3'>
      <div
        className='card'
        onClick={() => displayModal(candidate)}
        data-toggle='modal'
        data-target={`#candidate-${candidate.candidateId}-modal`}
      >
        <img
          src={`${CMS_BASE_URL}/${candidate.Picture}`}
          className='card-img-top'
          alt={candidate.Name}
        />
        <div className='card-body'>
          <h5 className='card-title'>{candidate.Name}</h5>
          <h6 className='card-subtitle mb-2 text-muted'>
            {candidate.organizationName}
          </h6>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
