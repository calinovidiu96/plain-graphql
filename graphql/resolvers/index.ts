import producerResolver from "./producerResolvers";
import productResolver from "./productResolvers";

const rootResolver = {
	Upload: require("graphql-upload-minimal").GraphQLUpload,
	...producerResolver,
	...productResolver,
};

export default rootResolver;
