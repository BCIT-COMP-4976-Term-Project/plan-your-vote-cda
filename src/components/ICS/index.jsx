import React from 'react';

const dateSelector = dates => {
  const options = dates.map(date => {
    return <option key={date} aria-describedby='info'>{date}</option>;
  });

  return <select id='dateSelector'>{options}</select>;
};

const ICS = () => {
  return (
    <div>
      <label
        htmlFor='dateSelector'
        aria-label='format: year month day'
        className='col-form-label'
        id='info'
      >
        Date:
      </label>
      {dateSelector(['2021-04-15', '2021-05-23', '2021-06-28'])}
      <div id='addtocalendar'>Add to Calendar</div>
      <button
        aria-label='Generating and downloading pdf summary of your plan. Remember to officially vote in person on election day.'
        className='btn btn-secondary'
      >
        Generate Voting Plan PDF
      </button>
    </div>
  );
};

export default ICS;
