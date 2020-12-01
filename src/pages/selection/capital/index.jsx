import React, { Component } from 'react';
import MultipleChoiceQuestion from 'components/MultipleChoiceQuestion';
import SectionHeader from 'components/SectionHeader';
import pyv from 'apis/pyv';
import { Link } from 'react-router-dom';
import * as routes from 'constants/routes';

class Capital extends Component {
  _isMounted = false;
  state = {
    header: {
      StepTitle: '',
      StepDescription: ''
    },
    ballotIssues: [],
    selectedAnswers: []
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadApiData().then(data => {

      if (this._isMounted) {
        const { StepTitle, StepDescription, StepNumber } = data.step;

        this.setState({
          ballotIssues: data.ballotIssues.ballotIssues.reverse(),
          header: {
            StepTitle,
            StepDescription,
            StepNumber
          }
        });
      }
    });

  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadApiData = async () => {
    const response = await pyv.get('/api/ballotissues');
    const step = await pyv.get('/api/steps/2');
    const data = {
      ballotIssues: response.data,
      step: step.data
    };
    return data;
  };

  radioBtn = (ballotIssueID, answer, title, description) => event => {
    const { selectedAnswers } = this.state;
    const copySA = selectedAnswers.slice(0);
    const found = selectedAnswers.findIndex(
      ballotIssue => ballotIssue.ballotIssueID === ballotIssueID
    );

    if (found > -1) {
      const temp = {
        ballotIssueID: ballotIssueID,
        ballotIssueAnswer: answer,
        ballotIssueTitle: title,
        ballotIssueDescription: description
      };

      copySA.splice(found, 1, temp);
    } else {
      const temp = {
        ballotIssueID: ballotIssueID,
        ballotIssueAnswer: answer,
        ballotIssueTitle: title,
        ballotIssueDescription: description
      };

      copySA.push(temp);
    }

    this.setState({ selectedAnswers: copySA }, () => {
      if (found > -1) {
        sessionStorage.removeItem('capitalAnswers');
      }
      sessionStorage.setItem('capitalAnswers', JSON.stringify(copySA));
    });
  };

  render() {

    const mcQ = this.state.ballotIssues.map(mcQuestions => {
      return (
        <MultipleChoiceQuestion
          key={mcQuestions.BallotIssueId}
          title={mcQuestions.BallotIssueTitle}
          description={mcQuestions.Description}
          name={mcQuestions.BallotIssueId}
          values={mcQuestions.BallotIssueOptions}
          radioFunction={this.radioBtn}
        />
      );
    });

    return (
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <SectionHeader
              title={this.state.header.StepTitle}
              level='2'
              description={this.state.header.StepDescription}
            />
          </div>
        </div>
        <div className='row mb-4'>{mcQ}</div>
        <br />
        <Link to={routes.CANDIDATES} className='btn btn-secondary  backBtn'>
          BACK
        </Link>
        <Link to={routes.SCHEDULE} className='btn btn-secondary  nextBtn'>
          NEXT
        </Link>
        <br />
        <br />
      </div>
    );
  }
}

export default Capital;
