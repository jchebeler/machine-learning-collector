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
		indResponses:[],
		depResponses:[],
	}
  }
  
  tableRows = () => {
	let rows = this.data.map((row, key) => {
      return (
        <tr key={key}>
			<td className={'question'}> {`${key + 1}) ${row.question}`} </td>
			<td > 
				<input type="checkbox" value="inp" name={`question_${key}`} checked={this.state.indResponses.indexOf(key) > -1} 
					onChange={(e) => this.handleChange(e, key, 'inp')} />
			</td>
			<td > 
				<input type="checkbox" value="dep"  name={`question_${key}`} checked={this.state.depResponses.indexOf(key) > -1} 
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
  
  handleChange = (e, value, type) => {
	  let joined = [];
	  let removed = [];
	  if(type === 'inp'){
		//if it doesnt exist in the array, its a new selection, add it and remove it from the other array
		if(this.state.indResponses.indexOf(value) === -1) {
			joined = this.state.indResponses.concat(value);
			removed = this.checkForRemoval(value, this.state.depResponses);
			this.setState({
				indResponses: joined,
				depResponses: removed,
			});
		}
		//if it does exist in the array, its a remove selection,remove it from this array
		else{
			removed = this.checkForRemoval(value, this.state.indResponses);
			this.setState({
				indResponses: removed,
			});
		}
		
	  }
	  else if(type === 'dep'){
		//if it doesnt exist in the array, its a new selection, add it and remove it from the other array
		if(this.state.depResponses.indexOf(value) === -1) {
			joined = this.state.depResponses.concat(value);
			removed = this.checkForRemoval(value, this.state.indResponses);
			this.setState({
				depResponses: joined,
				indResponses: removed,
			});
		}
		//if it does exist in the array, its a remove selection,remove it from this array
		else{
			removed = this.checkForRemoval(value, this.state.depResponses);
			this.setState({
				depResponses: removed,
			});
		};
	  }
  };
  
  checkForRemoval = (value, array) => {
	const finder = array.indexOf(value);
	if(finder > -1) {
		array.splice(finder,1);
	}
	return array;
  };
  
  handleSubmit = () => {
	  const allowSubmission = this.verifyData();
	  if(allowSubmission) {
		  //this.state.indResponses.sort();
		  //this.state.depResponses.sort();
		  alert('Congrats, your data has been submitted.');
	  }
	  else {
		  alert('Bad Input: You must select at least 1 independent variable and 1 dependent variable, or 2 independent variables to continue. ');
	  }
  };
  
  verifyData = () => {
	  if(this.state.indResponses.length >= 2 || (this.state.depResponses.length >= 1 && this.state.indResponses >= 1)){
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
				<div>{`Independent Results: ${this.state.indResponses.length > 0 ? this.state.indResponses : 'N/A'}`}</div> 
				<div>{`Dependent Results: ${this.state.depResponses.length > 0 ? this.state.depResponses : 'N/A'}`}</div>
			</div>
		</div>
    );
  }
}

export default App;
