import Product from "../../models/productModel";
import Producer from "../../models/producerModel";
import { uploadDocument } from "./helperFunctions/uploadDocuments";

type IProduct = {
	vintage: string;
	name: string;
	producerId: string;
	color: string;
	quantity: number;
	format: string;
	price: number;
	duty: string;
	availability: string;
	conditions?: string;
	imageUrl?: string;
};

type GetProductInput = {
	id: string;
};

type GetProductByProducerIdInput = {
	producerId: string;
};

type UpdateProductInput = {
	id: string;
	vintage: string;
	name: string;
	color: string;
	quantity: number;
	format: string;
	price: number;
	duty: string;
	availability: string;
	conditions: string;
	imageUrl: string;
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
			const product = await Product.findById(input.id);

			if (!product) {
				throw new Error("Product doesn't exist.");
			}

			const producerId = product.producerId;

			if (producerId) {
				const producer = await getProducerById(producerId.toString());
				return {
					...product.toJSON(),
					producer,
				};
			} else {
				throw new Error("Producer not found for this product.");
			}
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
					console.log("product", product);
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
			// Fetch producerIds from products
			const producerIds = products.map((product) => product.producerId);

			// Fetch all producers concurrently
			const producers = await Promise.all(
				producerIds.map(getProducerById)
			).catch((error) => {
				throw new Error(
					`Failed to fetch one or more producers: ${error}`
				);
			});

			const createdProducts = await Product.insertMany(products);

			// Format the created products to match the required structure
			const formattedProducts = createdProducts.map((product: any) => {
				const producer = producers.find(
					(producer) =>
						producer._id.toString() ===
						product.producerId.toString()
				);

				return {
					_id: product._id.toString(),
					vintage: product.vintage,
					name: product.name,
					producerId: product.producerId,
					color: product.color,
					quantity: product.quantity,
					format: product.format,
					price: product.price,
					duty: product.duty,
					availability: product.availability,
					conditions: product.conditions,
					imageUrl: product.imageUrl,
					producer,
				};
			});

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
			});

			if (!product) {
				throw new Error("Product not found.");
			}
			const producerId = product.producerId;

			if (producerId) {
				const producer = await getProducerById(producerId.toString());
				return {
					...product.toJSON(),
					producer,
				};
			} else {
				throw new Error("Producer not found for this product.");
			}
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
	uploadDocument,
};
