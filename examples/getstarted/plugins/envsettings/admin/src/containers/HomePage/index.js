/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import { Button } from 'strapi-helper-plugin';

const HomePage = () => {
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <Button primary></Button>
    </div>
  );
};

export default memo(HomePage);
