import React,  { Component } from 'react'
import { BrowserRouter  as Router, Route, Link } from 'react-router-dom';
import {Container, Row,Col,Form,Alert,Button,Badge} from 'react-bootstrap';
import $ from 'jquery';
import 'jquery-ui/themes/base/core.css';
import 'jquery-ui/themes/base/theme.css';
import 'jquery-ui/ui/core';
import 'jquery-ui/ui/widgets/slider';
import Adslider from "./Adslider";

class Advancesearch extends Component{
    constructor(){
        super();
        this.state = { searchValue:'', isSearching:'', searchSuggestion:'hide', community:null, selectedCommunity:'', city:'',listItems:[], batch:0, total:0, loadMore:false,  community_selected:'', min:18, max:45, isBind:false,showMessage:'Please select search criteria, to find people you want to search!'};
    }
  
    componentDidMount(){
      var _that = this;
      var {batch} = this.state;

      /*Get Community*/
      $.ajax({ method: "POST",url:"/actions/",data:{action:'getCommunity'}}).done(function(response){
          var _response = JSON.parse(response);
          if(_response.status=='success'){
              _that.setState({community:_response.data.community});
              
          }
          else{
              console.log('-------System Failure---------');
          }
      });
      
    }
    fetchSearchResult = function(_batch){
      var _that = this;
      const {loadMore} = this.state;
      const {listItems} = _that.state;
      const {selectedCommunity} = this.state;
      const {min} = this.state;
      const {max} = this.state;
      const {batch} = this.state;
      const {city} = this.state;
      const {gender} = this.state;
      let __batch;
      if(_batch==0)
      {
        __batch = _batch;
      }
      else{
        __batch = batch;
      }
              
      $.ajax({url:STATIC_URL+'/actions/',method:'POST',data:{action:'advanceSearch',community:selectedCommunity,gender:gender,city:city,start_age:min,end_age:max,batch:__batch}}).done(function(response){
           response = JSON.parse(response);  
           if(response.data.total==0){
             this.setState({showMessage:'Sorry! We don\'t have profile you are searching for.'});
           }
           if(loadMore==true)
           {  
              _that.setState({loadMore:false});
               var _temp = [...listItems,...response.data.people];
              _that.setState({listItems:_temp});
              _that.setState({total:parseInt(response.data.total)});
            }
           else
           {
              _that.setState({listItems:response.data.people});
              _that.setState({total:parseInt(response.data.total)});
           }
         });
  }

    communityChange = (e) => {
      var cvalue = e.currentTarget.value;
      this.setState({selectedCommunity:cvalue});
      if(cvalue=='other')
      {
          $('.communityOther').css('display','block');
      }
      else
      {
          $('.communityOther').css('display','block');
      }
    }
    handleChange = (e) =>{
        this.setState({[e.target.name]:e.target.value});
    }
    componentDidUpdate(prevProps){
        var _that = this;
        var {batch} = this.state;
        var {searchValue} = this.state;
        var {loadMore} = this.state;
        var ageRange = $('#ageRange');
        var sliderRange = $('#sliderRange');
        if(this.state.isBind==false){
          sliderRange.slider({
              range:true,
              min: 1,
              max: 100,
              values: [ 18, 45 ],
              create: function() {
                // var max = $(this).slider('values', 1);
                // var min = $(this).slider('values', 0);
                var min = $("#sliderRange").slider("option", "min");
                var max = $("#sliderRange").slider("option", "max");
                ageRange.val(" 18 year to 45 year");
                },
              slide: function Total(event, ui) {
                _that.setState({min:ui.values[0]});
                _that.setState({max:ui.values[1]});
              }
            });
            this.setState({isBind: true});
        }  
        var _that = this;
        var {batch} = this.state;
        var {searchValue} = this.state;
        var {loadMore} = this.state;
        if(loadMore==true){
            this.fetchSearchResult(batch);
        }
     }
    loadMoreAction = (e) => {
        var _batch = this.state.batch;
        _batch = _batch + 1;;
        this.setState({batch:_batch});
        this.setState({loadMore:true});
    }
    loadMore = (e) => {
        var {batch} = this.state; 
        if((batch*9)+9 < this.state.total){
           return  <button className="form-control btn-load" type="button" onClick={this.loadMoreAction} >Load More</button>
        }

    }
    handletextChange = (e) => {
      let _city = e.currentTarget.value;
      this.setState({city:_city});
    }
    handleSearch = (e) => {
      e.preventDefault();
      const {searchValue} = this.state;
      let _batch = 0;
      this.setState({batch:_batch});
      this.fetchSearchResult(_batch); 
   }
   genderChange = (e) => {
     e.preventDefault();
     let gender = e.currentTarget.value;
     this.setState({gender:gender});
   }
    render(){
        const {listItems} = this.state; 
        const {start_age} = this.state;
        const {end_age} = this.state;
        const {count} = this.state;
        const {community} = this.state;
        const {city} = this.state;
        if(community==null){
          return null;
      }
        return (
        <div className="container advsearch">
          <div className="filtersearch">
            <Form  onSubmit={this.handleSearch}>
              <div className="row">
                    <div className="col-sm-3">
                    <label htmlFor="formYourName" className="form-label">Community</label>
                      <div className="form-group serachname">
                          <Form.Control name="community" onChange={this.communityChange} as="select" required>
                                <option value="">Select Community</option>
                                {this.state.community.map((value,index)=>{
                                  return <option key={index} value={value.uuid}>{value.name}</option>
                                })}
                          </Form.Control>
                          <Form.Text className="text-muted"></Form.Text>
                      </div>
                    </div>
                   <div className="col-sm-2">
                    <label htmlFor="formYourName" className="form-label">Gender</label>
                      <div className="form-group serachname">
                          <Form.Control name="community" onChange={this.genderChange} as="select" required>
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                
                          </Form.Control>
                          <Form.Text className="text-muted"></Form.Text>
                      </div>
                    </div>
                    <div className="col-sm-2">
                  <label htmlFor="formYourName" className="form-label">City</label>
                      <div className="form-group serachname">
                      <input type="text" className="form-control" value={city} name="city" placeholder="City Name" onChange={this.handletextChange}/> 
                      </div>
                  </div>
                  <div className="col-sm-3">
                      <div  className="slidecontainer">
                        <span className="agetext">Age: </span>
                        <input type="text" min="1" max="80" className="slider-value" value={this.state.min+" year to "+this.state.max+" year"} id="ageRange" style={{'border':'0', 'color':'#000', 'fontWeight':'normal'}} required />
                      </div>
                      <div ref="slider" id="sliderRange">
                      </div>
                    <br/>
                  </div>  
                  <div className="col-sm-2">
                    <div style={{'marginTop':'25px'}}>
                     <button type="submit" className="btn btn-default"><i className="fa fa-search"  style={{'marginRight': '5px'}}></i>Search</button>
                    </div>
                  </div>                 
                </div>

                <div className="row">
                  
                                  
              </div>
               
            </Form>
          </div>
          <Adslider/>
              
          { (listItems!=null && listItems.length>0) &&
            <main className="result-section">
              <div className="container">
                  <div className="search-result">
                      <div className="row result-items">
                      {listItems.map((value, index) => {
                          return  <div key={index} className="col col-md-12 col-sm-12 col-lg-4">
                                      <div className="card">
                                          <div className="card-body">
                                              <h3 className="card-title">{value.fullName}</h3>
                                              <p className="card-text">S/O {value.father} | {(value.maritalStatus=='married')?'Married':'Un-married'}</p>
                                              <Link to={'/person/'+value.uuid} className="btn btn-show btn-sm"><i className="fa fa-tree"></i>Show Tree</Link>
                                          </div>
                                      </div>
                                  </div>
                          })}    
                      </div>
                      {this.loadMore()}
                  </div>
              </div>
            </main>
          }
          { (listItems!=null && listItems.length==0) &&
            <main className="result-section">
              <div className="container">
                  <div className="search-result">
                      <div className="row result-items">
                        <h4>{this.state.showMessage}</h4>
                      </div>
                     
                  </div>
              </div>
            </main>
          }
          </div>
          
        )
      }
    }

export default Advancesearch;