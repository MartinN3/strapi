/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
import { Link } from 'react-router-dom';
// import PropTypes from 'prop-types';
import { ContainerFluid } from 'strapi-helper-plugin';

import pluginId from '../../pluginId';

const HomePage = () => {
  return (
    <div>
      <ContainerFluid>
        <h1>{pluginId}&apos;s HomePage</h1>
        <Link to={`${pluginId}/configurations`}>
          {'menu-editor.ConfigPage.title'}
        </Link>
      </ContainerFluid>
    </div>
  );
};

export default memo(HomePage);
