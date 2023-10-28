'use strict';

/**
 * info-user service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::info-user.info-user');
