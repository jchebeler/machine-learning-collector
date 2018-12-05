import React, { Component } from 'react';
import './App.scss';

class App extends Component {
  constructor(props) {
	super(props);
	this.data = [
		{
			question: 'how are you?'
		},
		{
			question: 'what is my purpose?'
		},
		{
			question: 'what is your name?'
		}
	];
	this.state = {
		ind:[],
		dep:[],
	}
	this.indResponses = [];
	this.depResponses = [];
  }
  
  tableRows = () => {
	let rows = this.data.map((row, key) => {
      return (
        <tr key={key}>
			<td className={'question'}> {`${key + 1}) ${row.question}`} </td>
			<td > 
				<input type="radio" value="inp" name={`question_${key}`} 
					onChange={(e) => this.handleChange(e, key, 'inp')} />
			</td>
			<td > 
				<input type="radio" value="dep"  name={`question_${key}`} 
					onChange={(e) => this.handleChange(e, key, 'dep')} />
			</td>
		</tr>
      );
    });
	return (
		<React.Fragment>
			{rows}
			<tr>
				<td className={'question'}></td>
				<td ></td>
				<td > 
					<button onClick={() => this.handleSubmit()}>Submit </button>
				</td>
			</tr>
		</React.Fragment>
	);
  };
  
  handleChange = (e, index, type) => {
	  if(type === 'inp'){
		this.indResponses.push(index);
		this.checkForRemoval(index, this.depResponses);
	  }
	  else if(type === 'dep'){
		this.depResponses.push(index);
		this.checkForRemoval(index, this.indResponses);
	  }
  };
  
  checkForRemoval = (value, array) => {
	const finder = array.indexOf(value);
	if(finder > -1) { 
		array.splice(finder,1);
	}
  };
  handleSubmit = () => {
	  const allowSubmission = this.verifyData();
	  if(allowSubmission) {
		  this.indResponses.sort();
		  this.depResponses.sort();
		  this.setState({
			ind: this.indResponses,
			dep: this.depResponses,
		  });
	  }
	  else {
		  alert('Bad Input: You must select at least 1 independent variable and 1 dependent variable, or 2 independent variables to continue. ');
	  }
  };
  
  verifyData = () => {
	  if(this.indResponses.length >= 2 || (this.depResponses.length >= 1 && this.indResponses >= 1)){
		  return true;
	  }
	  return false;
  };
  render() {
    return (
		<div className={'content'}>
			<table>
				<tbody>
					<tr>
						<th className={'question'}> Question </th>
						<th> Independent </th>
						<th> Dependent </th>
					</tr>
					{this.tableRows()}
				</tbody>
			</table>
			<div>
				<div>{`Independent Results: ${this.state.ind.length > 0 ? this.state.ind : 'N/A'}`}</div> 
				<div>{`Dependent Results: ${this.state.dep.length > 0 ? this.state.dep : 'N/A'}`}</div>
			</div>
		</div>
    );
  }
}

export default App;
