import React from 'react';

const MultipleChoiceQuestion = ({
  title,
  description,
  name,
  values,
  radioFunction,
}) => {

  const options = values.map((item, index) => {
    return (
      <div key={index}>
        <input
          type='radio'
          name={name}
          onChange={radioFunction(
            name,
            item.IssueOptionInfo,
            title,
            description
          )}
          value={item.IssueOptionInfo}
        />
        {item.IssueOptionInfo}
      </div>
    );
  });

  return (
    <div className='col-md-12 mt-5'>
      <h5>{title}</h5>
      <p>{description}</p>
      <fieldset className='mcq-options'>
        <legend>How do you plan to answer {title}?</legend>
        {options}
      </fieldset>
    </div>
  );
};

export default MultipleChoiceQuestion;
