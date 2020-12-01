import React from 'react';
import { CMS_BASE_URL } from 'constants/baseURL';

const CandidateModal = ({
  position,
  candidate,
  selectFunction,
  selectedCandidates
}) => {
  const getDesiredDetail = key => {
    let desiredDetail;
    candidate.Details.map(detail => {
      if (detail.Title === key) {
        desiredDetail = detail;
      }
      return null;
    });
    return desiredDetail;
  };

  const displayPriority = priority => {
    if (!priority) {
      return null;
    }
    return priority.Text;
  };

  const contactMethodList = [
    'Phone',
    'Email',
    'Website',
    'Twitter',
    'Facebook',
    'Instagram',
    'Youtube',
    'Other'
  ];

  const displayContact = contactMethodList.map(cmItem => {
    let contactMethod = ``;
    let key = `${cmItem}`;
    const found = candidate.Contacts.find(
      contact => contact.ContactMethod === cmItem
    );
    if (found) {
      if (found.ContactMethod === 'Instagram') {
        let splitURL = found.ContactValue.split('/');
        let contactHandle = splitURL[splitURL.length - 1];

        if (contactHandle === '?hl=en' || contactHandle === '') {
          contactHandle = splitURL[splitURL.length - 2];
        }

        contactMethod += `@${contactHandle}`;
        contactMethod = <a href={found.ContactValue}> {contactMethod}</a>;
      }

      if (found.ContactMethod === 'Twitter') {
        let splitURL = found.ContactValue.split('/');
        let contactHandle = splitURL[splitURL.length - 1];
        contactMethod += `@${contactHandle}`;
        contactMethod = <a href={found.ContactValue}> {contactMethod}</a>;
      }

      if (found.contactMethod === 'Email') {
        contactMethod += found.ContactValue;
        contactMethod = (
          <a href={`mailto: ${contactMethod}`}> {contactMethod}</a>
        );
      }

      if (
        found.ContactMethod === 'Website' ||
        found.ContactMethod === 'Facebook' ||
        found.ContactMethod === 'Youtube' ||
        found.ContactMethod === 'Other'
      ) {
        contactMethod += found.contactValue;
        let splitURL = contactMethod.split('');
        if (
          splitURL[0] !== 'h' ||
          splitURL[1] !== 't' ||
          splitURL[2] !== 't' ||
          splitURL[3] !== 'p'
        ) {
          contactMethod = `https://${contactMethod}`;
        }

        contactMethod = <a href={contactMethod}> {contactMethod}</a>;
      }

      if (found.ContactMethod === 'Phone') {
        contactMethod += found.ContactValue;
      }
    } else {
      contactMethod += 'Not Provided';
    }

    return (
      <div key={key}>
        <span className='modalTitles'>{key}:</span> {contactMethod}
      </div>
    );
  });

  return (
    <div
      className='modal fade'
      id={`candidate-${candidate.CandidateId}-modal`}
      tabIndex='-1'
      role='dialog'
      aria-labelledby={`candidate-${candidate.CandidateId}-modal-label`}
      aria-hidden='true'
    >
      <div
        className='modal-dialog modal-lg modal-dialog-centered'
        role='document'
      >
        <div className='modal-content'>
          <div className='nonScroll'>
            <div className='modal-header'>
              <h3
                className='modal-title'
                id={`candidate-${candidate.CandidateId}-modal-label`}
              >
                {candidate.Name}
                <br />
                <span className='card-subtitle mb-2 text-muted'>
                  {candidate.OrganizationName}
                </span>
              </h3>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
          </div>
          <div className='modal-body'>
            <div className='nonScroll'>
              <img
                src={`${CMS_BASE_URL}/${candidate.Picture}`}
                className='card-img-top'
                alt={candidate.Name}
              />
              <button
                type='button'
                onClick={selectFunction(position, candidate)}
                className='btn btn-primary addCanBtn'
              >
                {selectedCandidates.length === 0
                  ? 'ADD'
                  : selectedCandidates.findIndex(
                      cand => cand.CandidateId === candidate.CandidateId
                    ) >= 0
                  ? 'REMOVE'
                  : 'ADD'}
              </button>
            </div>
            <div className='modalScroll'>
              <span className='modalTitles'>Top 3 Priorities</span>
              <br />
              <p>1. {displayPriority(getDesiredDetail('Priority 1'))}</p>
              <p>2. {displayPriority(getDesiredDetail('Priority 2'))}</p>
              <p>3. {displayPriority(getDesiredDetail('Priority 3'))}</p>
              <p className='modalTitles'>Platform</p>
              {displayPriority(getDesiredDetail('Platform'))}
              <p className='modalTitles'>Biography</p>
              {displayPriority(getDesiredDetail('Biography'))}
              {displayContact}
            </div>
            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                data-dismiss='modal'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;
