import Product from "../../models/productModel";
import Producer from "../../models/producerModel";
import { uploadDocuments } from "./helperFunctions/uploadDocuments";

type IProduct = {
	vintage: String;
	name: String;
	producerId: String;
	color: String;
	quantity: Number;
	format: String;
	price: Number;
	duty: String;
	availability: String;
	conditions?: String;
	imageUrl?: String;
};

type GetProductInput = {
	id: string;
};

type GetProductByProducerIdInput = {
	producerId: string;
};

type UpdateProductInput = {
	id: String;
	vintage: String;
	name: String;
	color: String;
	quantity: Number;
	format: String;
	price: Number;
	duty: String;
	availability: String;
	conditions: String;
	imageUrl: String;
};

const getProducerById = async (producerId: string) => {
	try {
		const producer = await Producer.findById(producerId);
		if (!producer) {
			throw new Error("Producer not found");
		}
		return producer;
	} catch (error) {
		throw new Error(`Failed to fetch producer. ${error}`);
	}
};

export default {
	getProduct: async (input: GetProductInput) => {
		try {
			const product = await Product.findById(input.id).populate(
				"producerId"
			);

			if (!product) {
				throw new Error("Product doesn't exist.");
			}

			const producer = product.producerId;

			return {
				...product.toJSON(),
				producer,
			};
		} catch (error) {
			throw new Error(`Failed to fetch product. ${error}`);
		}
	},
	getProductsByProducerId: async (input: GetProductByProducerIdInput) => {
		try {
			const products = await Product.find({
				producerId: input.producerId,
			});

			// Format the fetched products to match the required structure
			const formattedProducts = await Promise.all(
				products.map(async (product: any) => {
					const producer = await getProducerById(product.producerId);
					return {
						...product.toJSON(),
						producer,
					};
				})
			);
			return formattedProducts;
		} catch (error) {
			throw new Error(
				`Failed to fetch products by producer ID. ${error}`
			);
		}
	},
	createProducts: async ({ products }: { products: IProduct[] }) => {
		try {
			const createdProducts = await Product.insertMany(products);

			// Format the created products to match the required structure
			const formattedProducts = createdProducts.map(
				async (product: any) => {
					const producer = await getProducerById(product.producerId);
					return {
						...product.toJSON(),
						producer,
					};
				}
			);

			return formattedProducts;
		} catch (error) {
			throw new Error(`Failed to create products. ${error}`);
		}
	},
	updateProduct: async ({
		updateProductInput,
	}: {
		updateProductInput: UpdateProductInput;
	}) => {
		try {
			const { id, ...updates } = updateProductInput;
			const product = await Product.findByIdAndUpdate(id, updates, {
				new: true,
			}).populate("producerId");

			if (!product) {
				throw new Error("Product not found.");
			}

			const producer = product.producerId;
			return {
				...product.toJSON(),
				producer,
			};
		} catch (error) {
			throw new Error(`Failed to update product. ${error}`);
		}
	},
	deleteProducts: async ({ _ids }: { _ids: string[] }) => {
		try {
			const deletedProductIds = [];

			for (const id of _ids) {
				const deletedProduct = await Product.findByIdAndDelete(id);

				if (deletedProduct) {
					deletedProductIds.push(id);
				}
			}

			return deletedProductIds;
		} catch (error) {
			throw new Error(`Failed to delete products. ${error}`);
		}
	},
	uploadDocuments,
};
