import mongoose, { Schema, InferSchemaType } from "mongoose";
import slugify from "slugify";

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "products";

const productSchema = new Schema(
    {
        product_name: { type: String, required: true },
        product_thumb: { type: String, required: true },
        product_slug: { type: String },
        product_price: { type: Number, required: true },
        product_quantity: { type: Number, required: true },
        product_desc: { type: String },
        product_type: {
            type: String,
            required: true,
            enum: ["Electronic", "Clothing", "Furniture"],
        },
        product_shop: { type: Number, ref: "Shop" },
        product_attributes: { type: Schema.Types.Mixed, required: true },
        product_ratings_average: {
            type: Number,
            default: 4.5,
            min: [1, "Rating must be above 1.0"],
            max: [5, "Rating must be below 5.0"],
            set: (value: number) => Math.round(value * 10) / 10,
        },
        product_variations: { type: Array, default: [] },
        is_draft: { type: Boolean, default: true, index: true, select: false },
        is_published: {
            type: Boolean,
            default: false,
            index: true,
            select: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
);

const clothingSchema = new mongoose.Schema(
    {
        product_shop: { type: Number, ref: "Shop" },
        brand: { type: String, require: true },
        size: { type: String },
        material: { type: String },
    },
    {
        timestamps: true,
        collection: "clothes",
    }
);

// Create index for text search
productSchema.index({ productName: "text", productDescription: "text" });

// Mongo middleware: run after create() and save()
productSchema.pre("save", function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next();
});

const electronicSchema = new mongoose.Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        manufacturer: { type: String, require: true },
        model: { type: String },
        color: { type: String },
    },
    {
        timestamps: true,
        collection: "electronics",
    }
);

const furnitureSchema = new mongoose.Schema(
    {
        product_shop: { type: Schema.Types.ObjectId, ref: "Shop" },
        branch: { type: String, require: true },
        size: { type: String },
        material: { type: String },
    },
    {
        timestamps: true,
        collection: "furnitures",
    }
);

export type Product = InferSchemaType<typeof productSchema>;

const product = mongoose.model<Product>(DOCUMENT_NAME, productSchema);
const clothing = mongoose.model("Clothing", clothingSchema);
const electronic = mongoose.model("Electronic", electronicSchema);
const furniture = mongoose.model("Furniture", furnitureSchema);

export { product, clothing, electronic, furniture };
