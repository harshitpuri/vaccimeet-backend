"use strict";
const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    // Create meet with linked user
    async create(ctx) {
        let entity;
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          data.user = ctx.state.user.id;
          entity = await strapi.services.meets.create(data, { files });
        } else {
          ctx.request.body.user = ctx.state.user.id;
          entity = await strapi.services.meets.create(ctx.request.body);
        }
        return sanitizeEntity(entity, { model: strapi.models.meets });
      },

    // Updated user meets
    async update(ctx) {
        const { id } = ctx.params;
    
        let entity;
    
        const [meets] = await strapi.services.meets.find({
          id: ctx.params.id,
          'user.id': ctx.state.user.id,
        });
    
        if (!meets) {
          return ctx.unauthorized(`You can't update this entry`);
        }
    
        if (ctx.is('multipart')) {
          const { data, files } = parseMultipartData(ctx);
          entity = await strapi.services.meets.update({ id }, data, {
            files,
          });
        } else {
          entity = await strapi.services.meets.update({ id }, ctx.request.body);
        }
    
        return sanitizeEntity(entity, { model: strapi.models.meets });
      },

    // Delete a user meet
    async delete(ctx) {
        const { id } = ctx.params;
    
        const [meets] = await strapi.services.meets.find({
          id: ctx.params.id,
          "user.id": ctx.state.user.id,
        });
    
        if (!meets) {
          return ctx.unauthorized(`You can't update this entry`);
        }
    
        const entity = await strapi.services.meets.delete({ id });
        return sanitizeEntity(entity, { model: strapi.models.meets });
      },

    // Get logged in users
    async me(ctx) {
      const user = ctx.state.user;
  
      if (!user) {
        return ctx.badRequest(null, [
          { messages: [{ id: "No authorization header was found" }] },
        ]);
      }
  
      const data = await strapi.services.meets.find({ user: user.id });
  
      if (!data) {
        return ctx.notFound();
      }
  
      return sanitizeEntity(data, { model: strapi.models.meets });
    },
  };