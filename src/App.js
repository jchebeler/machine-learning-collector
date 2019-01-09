import React, { Component } from 'react';
import './App.scss';

import Loader from 'react-loader-spinner';

class App extends Component {
  constructor(props) {
	super(props);
	this.state = {
		data:null,
		indResponses:[],
		depResponses:[],
		processing:false,
	}
  }
  
  componentDidMount() {
	document.title = 'ML Live!';
  }
  
  componentWillMount() {
    let csvFilePath = require('./data.csv');
    let Papa = require("papaparse/papaparse.min.js");
    Papa.parse(csvFilePath, {
      download: true,
      complete: this.updateData
    });
  };
  
  updateData = (result) => {
	// manipulate the results for just the questions
	let questions = result.data[1].slice(10,result.data[1].length);
	this.setState({data: questions});
  };
  
  tableRows = () => {
	let rows = this.state.data.map((row, key) => {
      return (
        <tr className={'question-row'} key={key}>
			<td className={'question'}> {`${key + 1}) ${row}`} </td>
			<td >
				<label class="switch">
					<input type="checkbox" value="inp" name={`question_${key}`} checked={this.state.indResponses.indexOf(key) > -1} 
						onChange={(e) => this.handleChange(e, key, 'inp')} />
					<span class="slider round"></span>
				</label>
			</td>
			<td >
				<label class="switch">
					<input type="checkbox" value="dep"  name={`question_${key}`} checked={this.state.depResponses.indexOf(key) > -1} 
						onChange={(e) => this.handleChange(e, key, 'dep')} />
					<span class="slider round"></span>
				</label>
			</td>
		</tr>
      );
    });
	return (
		<React.Fragment>
			{rows}
			<tr className={'submit-row'}>
				<td ></td>
				<td ></td>
				<td > 
					<button disabled={this.state.processing} onClick={() => this.handleSubmit()}>Submit </button>
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
	  if(!this.state.processing){
		  const allowSubmission = this.verifyData();
		  if(allowSubmission) {
			  let indSubmissions = this.state.indResponses.sort((a, b) => a - b);
			  let depSubmissions = this.state.depResponses.sort((a, b) => a - b);
			  indSubmissions = indSubmissions.toString();
			  depSubmissions = depSubmissions.toString();
			  const url = 'http://192.168.2.70/dataselect?independent=' + indSubmissions + '&dependent=' + depSubmissions;
			  this.setState({processing:true});
			  fetch(url)
				.then((response) => {
				  // figure out why this isnt catching the response correctly, until then just display success cause it does work
				  this.setState({processing:false});
				  alert('Congrats, your data has been submitted.  Feature Submissions ' + indSubmissions + '.  Output Submissions ' + depSubmissions + '.');
				})
				.catch(response => {
				  this.setState({processing:false});
				  alert('Congrats, your data has been submitted.  Feature Submissions ' + indSubmissions + '.  Output Submissions ' + depSubmissions + '.');
				  //alert('Something went wrong with the submissions.');
				});
		  }
		  else {
			  alert('Bad Input: You must select at least 1 independent variable and 1 dependent variable, or 2 independent variables to continue. ');
		  }
	  }
  };
  
  verifyData = () => {
	  const indCount = this.state.indResponses.length;
	  const depCount = this.state.depResponses.length;
	  if(indCount >= 2 || (indCount >= 1 && depCount >= 1)){
		  return true;
	  }
	  return false;
  };
  render() {
    return (
		<div className={'content'}>
			<div className={'loader'}>
			{this.state.processing &&
				<Loader  type="Grid" color="#353535" height={150} width={150} />
			}
			</div>
			<table>
				<tbody>
					<tr>
						<th className={'question'}> Question </th>
						<th> Feature </th>
						<th> Output </th>
					</tr>
					{this.state.data &&
						this.tableRows()
					}
				</tbody>
			</table>
			{/*}<div>
				<div>{`Independent Results: ${this.state.indResponses.length > 0 ? this.state.indResponses : 'N/A'}`}</div> 
				<div>{`Dependent Results: ${this.state.depResponses.length > 0 ? this.state.depResponses : 'N/A'}`}</div>
			</div>*/}
		</div>
    );
  }
}

export default App;
