import ProductFilter from "../components/product-filter";

const Shop = () => {
    return (
        <div className="min-h-screen bg-background">


            {/* Products Section with Margin */}
            <div className="container mx-auto px-4 lg:px-8">
                <ProductFilter />
            </div>
        </div>
    );
};

export default Shop;
