import React,  { Component, useState, useEffect } from 'react'
import { BrowserRouter  as Router, Route, Link } from 'react-router-dom';
import './css/search.css';
class Search extends Component{
    constructor(props){
        super(props);
        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }
    state = {
        searchValue: '',
        isSearching: '',
        searchSuggestion:'hide',
        community: null,
    }
    setWrapperRef(node){
        this.wrapperRef = node;
    }
    handleChange = (e) => {
        var _that = this;
        this.setState({searchValue:e.target.value});
        if(e.target.value.length>0)
        {
            $.ajax({url:STATIC_URL+'/actions/',method:'POST',data:{action:'memberNameSuggest',userString:e.target.value}}).done(function(response){
                response = JSON.parse(response);  
                if(response.status==1){
                    _that.setState({suggestion:response.users})
                }
                });
            this.setState({isSearching:'is-searching'});
            this.setState({searchSuggestion:'show'});
        }
        else
        {
            this.setState({isSearching:''});
            this.setState({searchSuggestion:'hide'});
        }
    }
    searchNow = (e) => {
        e.preventDefault();
        var _that = this;
        _that.props.history.push('/search-result?q='+this.state.searchValue.replace(' ','+'));
    }
    renderSuggestion = () =>{
        const {suggestion} = this.state;
        if(suggestion==null)
        return null;
        else
        {
            return  <ul className="dataList">
                    { 
                        suggestion.map((value,index)=>{
                            return <li className="move" key={index}><Link tab-index={index+2} to={'/search-result?q='+value}>{value}</Link></li>
                        })
                    }
                </ul>
    
        }

    }
    componentDidMount(){
        document.addEventListener("keydown", this.effecthandler, false);
    }
    componentDidUpdate(){

               
    }
    effecthandler = (e)=>{
            if (e.keyCode == 40) {      
              
              let p = $('li.selected');
              if(p.length==0)
              {
                $('li').eq(0).addClass('selected');
                return false;   
              }
              let q = p.parent().children().index(p);
              $('li.move').removeClass('selected');
              if(p.parent().children().length==q+1)
              {
                $('li').eq(0).addClass('selected');
              }
              else
              {
                $('li').eq(q+1).addClass('selected');
              }
             }
             if (e.keyCode == 38) {      
              let p = $('li.selected');
              if(p.length==0)
              {
                $('li').eq(0).addClass('selected');
                return false;   
              }
  
              let q = p.parent().children().index(p);
              $('li.move').removeClass('selected');
              if(q-1<0)
              {
                $('li.move').eq(p.parent().children().length-1).addClass('selected');
              }
              else
              {
                $('li.move').eq(q-1).addClass('selected');
              }
             }
    }
    handleClickOutside = (e) =>{
        var _that = this;
        if(_that.wrapperRef && !this.wrapperRef.contains(event.target)){
            this.setState({isSearching:''});
            this.setState({searchSuggestion:'hide'});
        }
    }

    render(){
        // const {community} = this.state;
        // if(community==null){
        //     return <img src="/palm-tree.gif" style={{width:'100%'}}/>;
        // }
        const {isSearching} = this.state;
        const {searchSuggestion} = this.state;
    return  <div className="landing-page">
                <div className="home_banner">
                    <div ref={this.setWrapperRef} onKeyPress={this.effecthandler} className="search container">
                        <div className="search-page">
                            <div className="row">
                                <div className="col col-md-12 col-sm-1">
                                    <form autoComplete="off" onSubmit={this.searchNow} className={"form "+isSearching}>
                                        <div className="form-group search-container">
                                            <input tab-index="1" type="text" value={this.state.searchValue} onChange={this.handleChange} className="form-control box-search" placeholder="Search" name="q"/>
                                            <button className="form-control btn-search" type="submit"><i className="fa fa-search"></i> Search</button> 
                                            <div className={"searchSuggestion "+searchSuggestion}>
                                                <div className="searchSuggestionSeperator"></div>
                                                {this.renderSuggestion()}
                                            </div>
                                        </div>
                                    </form>
                                    <div className="updateinfo">
                                        <h3 className="infoContent">Want to update your family Information?</h3>
                                        <h3 className="hindiContent">क्या आप अपने परिवार की जानकारी साझा करना चाहोगे?</h3> 
                                        <span className="formbtn"><Link to="/landingpage">Yes/हाँ</Link></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="centertext">
                <h2>Discover your family tree, together</h2>
                <h6>Discover your family's unique story</h6>
                <div className="row">
                    <div className="col-md-4">
                        <img src={IMAGE_URL+"/app/assets/mockup-img/icon-left.png"} alt="" className="img-card"/>
                        <h6>It’s simple to get started</h6>
                        <p>Start with what you know and we’ll help you discover the rest</p>
                    </div>
                    <div className="col-md-4">
                        <img src={IMAGE_URL+"/app/assets/mockup-img/icon-center.png"} alt="" className="img-card"/>
                        <h6>Explore your family’s amazing journey</h6>
                        <p>Find out who your anceestors were, how they lived and what they did</p>
                    </div>
                    <div className="col-md-4">
                        <img src={IMAGE_URL+"/app/assets/mockup-img/icon-right.png"} alt="" className="img-card"/>
                        <h6>Safe and secure, forever</h6>
                        <p>Keep your tree with us forever, even if you cancel your subscription</p>
                    </div>
                </div>
                <button className="tree-start" type="submit">Start your tree</button>
            </div>
            <div className="bottomtext">
                <div className="row">
                    <div className="col-md-4 bottom-top">
                        <h4>Pick a family member</h4>
                        <img src={IMAGE_URL+"/app/assets/mockup-img/left-img.png"} alt=""/>
                    </div>
                    <div className="col-md-4 bottom-center">
                        <img src={IMAGE_URL+"/app/assets/mockup-img/center-img.png"} alt=""/>
                    </div>
                    <div className="col-md-4 bottom-last">
                        <h4>What family search can find</h4>
                        <img src={IMAGE_URL+"/app/assets/mockup-img/right-img.png"} alt=""/>
                    </div>
                </div>
            </div>
            </div>
            
    }
}
export default Search;