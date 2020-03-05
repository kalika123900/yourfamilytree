import React, { Component, Fragment } from 'react'
import { BrowserRouter as BrowserRouter, Switch, Route, Router } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Search from './Search';
import LoginPage from './LoginPage';
import Landingpage from './Landingpage';
import SearchResult from './SearchResult';
import Advancesearch from './Advancesearch';
import Aftersubmition from './Aftersubmition';
import Aboutus from './Aboutus';
import Contact from './Contact';
import Join from './Join';
import Tree from './Tree';
import Join from './Join';
import Profile from './Profile';
import PropTypes from 'prop-types'
import { makeSecureDecrypt } from '../helper/security';
import Notifications, { notify } from 'react-notify-toast';
import ReactGA from 'react-ga';
import Dashboard from './Dashboard';

class GAListener extends React.Component {
	static contextTypes = {
		router: PropTypes.object
	};

	componentDidMount() {
		this.sendPageView(this.context.router.history.location);
		this.context.router.history.listen(this.sendPageView);

	}

	sendPageView(location) {
		ReactGA.set({ page: location.pathname });
		ReactGA.pageview(location.pathname);
	}

	render() {
		return this.props.children;
	}
}
class App extends Component {

	constructor(props) {
		super(props);

		let _isLogin = false;
		let _fullName = '';
		let _uuid = null;
		if (localStorage.getItem('__person') !== null) {
			let person = localStorage.getItem('__person');

			let personObject = makeSecureDecrypt(person);
			if (personObject == false) {
				console.log('**HACKING ATTACK PREVENTED**')
			}
			if (personObject.login == 1) {
				_isLogin = true;
				_fullName = personObject.name;
				_uuid = personObject.uuid;
			}
		}
		this.state = {
			isSubmit: 0,
			submittedByFullName: '',
			isLogin: _isLogin,
			fullName: _fullName,
			uuid: _uuid
		}

	}



	generateHeader = (e) => {
		return <Header isLogin={this.state.isLogin} fullName={this.state.fullName} />;

	}
	generateFooter = (e) => {
		this.state.username == null
		{
			return <Footer />
		}
	}
	takeSuggestion = (data) => {
		if (this.state.isLogin == false) {
			this.setState({ submittedByFullName: data.name + " " + data.father_name + " " + data.surname })
			this.setState({ uuid: data.uuid });
		}
		this.setState({ isSubmit: 1 });
	}
	render() {
		ReactGA.initialize('UA-155190286-1');
		return <BrowserRouter>
			<GAListener>
				<div className="main">{this.generateHeader()}
					<Switch>
						<Route exact path="/" render={props => (<Search {...props} />)} />
						<Route exact path="/loginpage" render={props => (<LoginPage  {...props} isLogin={this.state.isLogin} />)} />
						<Route exact path="/landingpage" render={props => (<Landingpage isLogin={this.state.isLogin} {...props} submitSuccess={this.takeSuggestion} />)} />
						<Route exact path="/advancesearch" render={props => (<Advancesearch isLogin={this.state.isLogin} {...props} submitSuccess={this.takeSuggestion} />)} />
						<Route exact path="/suggestion" render={props => (<Aftersubmition isLogin={this.state.isLogin} {...props} uuid={this.state.uuid} />)} />
						<Route exact path="/search-result" render={props => (<SearchResult isLogin={this.state.isLogin} {...props} />)} />
						<Route exact path="/aboutus" render={props => (<Aboutus {...props} isLogin={this.state.isLogin} />)} />
						<Route exact path="/contact" render={props => (<Contact {...props} isLogin={this.state.isLogin} />)} />
						<Route exact path="/profile" render={props => (<Profile {...props} isLogin={this.state.isLogin} uuid={this.state.uuid} />)} />
						<Route exact path="/join" render={props => (<Join {...props} {...props} isLogin={this.state.isLogin} submitSuccess={this.takeSuggestion} />)} />
						<Route exact path="/dashboard" render={props => (<Dashboard {...props} isLogin={this.state.isLogin} uuid={this.state.uuid} />)} />
						<Route path="/person/:uuid" render={props => (<Tree {...props} isLogin={this.state.isLogin} />)} />

					</Switch>
					{this.generateFooter()}
					<Notifications />
				</div>
			</GAListener>
		</BrowserRouter>


	}
}


export default App
