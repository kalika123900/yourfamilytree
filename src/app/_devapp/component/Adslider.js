import React from "react";
import $ from "jquery";
export default class Adslider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: [
        { img: STATIC_URL+"/app/assets/images/1.jpeg" },
        { img: STATIC_URL+"/app/assets/images/2.jpeg" },
        { img: STATIC_URL+"/app/assets/images/3.jpeg" },
        { img: STATIC_URL+"/app/assets/images/4.jpeg" },
        { img: STATIC_URL+"/app/assets/images/5.jpeg" },
        ],
      i: 0
    };
  }

  componentDidMount() {
    var _that = this;
    setInterval(function() {
      var _container = _that.refs.imgcontainer;
      var prevShowing = _that.state.i;
      var currentShowing =
        prevShowing === _that.state.image.length - 1 ? 0 : _that.state.i + 1;

      $(_container)
        .find("img:eq(" + prevShowing + ")")
        .fadeOut("fast", function() {
          $(_container)
            .find("img:eq(" + currentShowing + ")")
            .fadeIn("slow");
        });

      let setI = currentShowing;
      _that.setState({ i: setI });
    }, 5000);
  }

  render() {
    var _that = this;
    return (
      <section ref="imgcontainer" id="product">
        {_that.state.image.map(function(value, index) {
          return (
            <img
              style={{ display: index === 0 ? "" : "none" }}
              alt=""
              key={index}
              src={value.img}
            />
          );
        })}
      </section>
    );
  }
}