import ProductCard from "./components/product-card";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Smart Product Card</h1>
        <p className="text-gray-600 mt-2">
          Click the product to expand size, colors, and add to cart
        </p>
      </div>

      <div className="flex justify-center">
        <ProductCard />
      </div>
    </div>
  );
}

export default App;
