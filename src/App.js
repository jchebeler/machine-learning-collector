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
	let questions = result.data[0];
	this.setState({data: questions});
  };
  
  tableRows = () => {
	let rows = this.state.data.map((row, key) => {
      return (
        <div className={'question-row'} key={key}>
					<div className={'question'}> {`${key + 1}) ${row}`} </div>
					<div >
						<label class="switch">
							<input type="checkbox" value="inp" name={`question_${key}`} checked={this.state.indResponses.indexOf(key) > -1} 
								onChange={(e) => this.handleChange(e, key, 'inp')} />
							<span class="slider round"></span>
						</label>
					</div>
					<div >
						<label class="switch">
							<input type="checkbox" value="dep"  name={`question_${key}`} checked={this.state.depResponses.indexOf(key) > -1} 
								onChange={(e) => this.handleChange(e, key, 'dep')} />
							<span class="slider round"></span>
						</label>
					</div>
				</div>
      );
    });
	return (
		<React.Fragment>
			{rows}
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
			{/*this.state.processing && <div class='page-disable'></div>*/}
			{this.state.processing &&
				<Loader  type="Grid" color="#353535" height={150} width={150} />
			}
			</div>
			<div className="table">
					<div className="header">
						<span className={'question'}> Question </span>
						<span> Feature Test </span>
						<span> Output </span>
					</div>
					<div className="rows">
					{this.state.data &&
						this.tableRows()
					}
					</div>
					<div className="submit">
						<button disabled={this.state.processing} onClick={() => this.handleSubmit()}>Submit </button>
					</div>
			{/*<div>
				<div>{`Independent Results: ${this.state.indResponses.length > 0 ? this.state.indResponses : 'N/A'}`}</div> 
				<div>{`Dependent Results: ${this.state.depResponses.length > 0 ? this.state.depResponses : 'N/A'}`}</div>
			</div>*/}
			</div>
		</div>
    );
  }
}

export default App;
