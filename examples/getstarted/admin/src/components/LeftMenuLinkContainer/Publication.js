import React from 'react';
import { FormattedMessage } from 'react-intl';
import LeftMenuLink from '../LeftMenuLink';

const Publication = props => (
  <>
    <p className="title">
      <FormattedMessage
        defaultMessage="Publication"
        id="app.components.LeftMenuLinkContainer.customButtons"
      />
    </p>
    <ul className="list">
      <LeftMenuLink
        {...props}
        icon="arrow-right"
        label="Go to website"
        destination={`https://${window.location.hostname}`}
      />

      {/* 
      <LeftMenuLink
          {...props}
          icon="refresh"
          label="Build gatsby"
          destination="https://clevercms.clance.local/cgi-bin/build-gatsby.sh"
        /> */}

      <LeftMenuLink
        {...props}
        icon="play"
        label="Publish"
        destination={`https://${window.location.hostname}/cgi-bin/deploy_gridsome.sh`}
      />
    </ul>
  </>
);

export default Publication;
