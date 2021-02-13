import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "semantic-ui-react";

const AnyReactComponent = () => <Icon name="marker" size="big" color="red" />;

class SimpleMap extends Component {
  static defaultProps = {
    zoom: 11
  };


  render() {
      const ltlng= this.props.ltlng;
      console.log(ltlng);
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "300px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDL5zzvrNsQfG8h42UKuDoBIYjZXOnp4kA" }}
          defaultCenter={ltlng}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent lat={ltlng.lat} lng={ltlng.lng} />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
