import React, { Component } from 'react';
import SectionHeader from 'components/SectionHeader';
import CandidateCard from 'components/CandidateCard';
import CandidateModal from 'components/CandidateModal';
import CandidateSection from 'components/CandidateSectionHeader';
import pyv from 'apis/pyv';
import { Link } from 'react-router-dom';
import * as routes from 'constants/routes';
import CandidatesCount from 'components/TotalCandidates';

class Candidates extends Component {
  _isMounted = false;

  state = {
    races: [],
    candidatesHeader: {
      StepTitle: '',
      StepDescription: ''
    },
    selectedCandidates: [],
    currentCard: {
      CandidateId: '',
      Name: '',
      Picture: '',
      Contacts: [
        {
          ContactMethod: '',
          ContactValue: ''
        }
      ],
      Details: [
        {
          Title: '',
          Text: '',
          Format: ''
        }
      ]
    },
    sortOption: ''
  };

  componentDidMount() {
    this._isMounted = true;
    this.loadCandidatesApi().then(response => {
      if (this._isMounted) {
        const { StepTitle, StepDescription, StepNumber } = response.step;
        this.setState({
          races: response.races.races,
          candidatesHeader: {
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

  loadCandidatesApi = async () => {
    const races = await pyv.get('/api/races');
    const step = await pyv.get('/api/steps/1');
    const data = { races: races.data, step: step.data };
    return data;
  };

  selectBtn = (position, candidate) => event => {
    const { selectedCandidates } = this.state;
    const newCandidates = selectedCandidates.slice(0);
    const found = selectedCandidates.findIndex(
      cand => cand.CandidateId === candidate.CandidateId
    );

    if (found > -1) {
      newCandidates.splice(found, 1);
    } else {
      const temp = {
        CandidateId: candidate.CandidateId,
        Name: candidate.Name,
        Picture: candidate.Picture,
        CandidatePosition: position,
        Details: candidate.Details,
        OrganizationName: candidate.OrganizationName,
        Contacts: candidate.Contacts
      };

      newCandidates.push(temp);
    }

    this.setState({ selectedCandidates: newCandidates }, () => {
      if (found > -1) {
        sessionStorage.removeItem('selectedCandidateRaces');
      }
      sessionStorage.setItem(
        'selectedCandidateRaces',
        JSON.stringify(newCandidates)
      );
    });
  };

  displayModal = candidate => {
    if (this._isMounted) {
      this.setState({
        currentCard: candidate
      });
    } else {
      console.error('unable to set state');
    }
  };


  renderCandidates = race => {
    if (!race) {
      return null;
    }

    return race.Candidates.map(candidate => {
      if (!candidate) {
        return null;
      }

      return (
        <CandidateCard
          key={candidate.CandidateId}
          candidate={candidate}
          displayModal={this.displayModal}
        />
      );
    });
  };

  renderModal = () => {
    const { selectedCandidates } = this.state;
    return this.state.races.map(race => {
      return race.Candidates.map(candidate => {
        return (
          <CandidateModal
            key={candidate.CandidateId}
            position={race.PositionName}
            candidate={candidate}
            selectFunction={this.selectBtn}
            selectedCandidates={selectedCandidates}
          />
        );
      });
    });
  };

  sortCandidates = e => {
    if (this._isMounted) {
      this.setState({
        sortOption: e.target.value
      });
    }

    let races = this.state.races;

    if (e.target.value === 'ballot-order') {
      for (const race of races) {
        race.Candidates.sort((a, b) => {
          return a.ballotOrder - b.ballotOrder;
        });
      }
    } else if (e.target.value === 'asc') {
      for (const race of races) {
        race.Candidates.sort(this.sortByNameAsc);
      }
    } else if (e.target.value === 'desc') {
      for (const race of races) {
        race.Candidates.sort(this.sortByNameDesc);
      }
    }

    if (this._isMounted) {
      this.setState({
        races
      });
    }
  };

  sortByNameAsc = (a, b) => {
    if (a.Name < b.Name) {
      return -1;
    }
    if (a.Name > b.Name) {
      return 1;
    }
    return 0;
  };

  sortByNameDesc = (a, b) => {
    if (a.Name < b.Name) {
      return 1;
    }
    if (a.Name > b.Name) {
      return -1;
    }
    return 0;
  };

  render() {
    const { candidatesHeader } = this.state;
    const { selectedCandidates } = this.state;

    const positions = [];
    this.state.races.forEach(race => {
      positions.push(race.PositionName);
    });

    const candidates =
      this.state.races.length === 0
        ? null
        : positions.map(can => {
            let found = this.state.races.find(pos => pos.PositionName === can);
            return (
              <div className='row' key={found.PositionName}>
                <div className='col-12'>
                  <h2 key={found.NumberNeeded}>
                    <span className='candidateTitle'>{found.PositionName}</span>
                  </h2>
                  <CandidateSection
                    key={found.PositionName}
                    candidatePosition={found.PositionName}
                    races={this.state.races}
                  />
                </div>

                {this.renderCandidates(found)}
              </div>
            );
          });

    const positionsSummary = [];
    this.state.races.forEach(race => {
      positionsSummary.push({
        PositionName: race.PositionName,
        NumberNeeded: race.NumberNeeded
      });
    });

    return (
      <div className='container'>
        <div className='canTable'>
          <CandidatesCount
            candidateJSON={selectedCandidates}
            positions={positionsSummary}
          />
        </div>

        <select
          className='custom-select mb-3'
          onChange={this.sortCandidates}
          value={this.state.sortOption}
        >
          <option value='ballot-order'>Ballot Order</option>
          <option value='asc'>A to Z</option>
          <option value='desc'>Z to A</option>
        </select>
        <SectionHeader
          title={candidatesHeader.StepTitle}
          level='2'
          description={candidatesHeader.StepDescription}
        />
        {candidates}
        {this.renderModal()}
        <br />
        <Link to={routes.CAPITAL} className='btn btn-secondary  nextBtn'>
          NEXT
        </Link>
        <br />
        <br />
      </div>
    );
  }
}
export default Candidates;
