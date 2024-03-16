import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import mongoose from "mongoose";
import dotenv from "dotenv";
const { processRequest } = require("graphql-upload-minimal");

dotenv.config();

import graphQlSchema from "./graphql/schemas";
import graphQlResolvers from "./graphql/resolvers";

const CONNECTION_STRING = process.env.DB_STRING as string;

const app = express();

app.use(
	"/graphql",
	createHandler({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
	})
);

app.use(
	"/uploadFile",
	createHandler({
		schema: graphQlSchema,
		rootValue: graphQlResolvers,
		// @ts-ignore
		async parseRequestParams(req) {
			const params = await processRequest(req.raw, req.context.res);
			if (Array.isArray(params)) {
				throw new Error("Batching is not supported");
			}
			return {
				...params,
				// variables must be an object as per the GraphQL over HTTP spec
				variables: Object(params.variables),
			};
		},
	})
);

const PORT = 3000;

mongoose
	.connect(CONNECTION_STRING)
	.then(() => {
		app.listen(PORT);
		console.log("Database connected!");
		console.log(`API is running on http://localhost:${PORT} `);
	})
	.catch((err) => {
		console.log(err);
	});
