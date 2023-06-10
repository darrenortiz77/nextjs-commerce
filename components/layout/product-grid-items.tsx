import Grid from 'components/grid';
import ProductCard from 'components/product/product-card';
import { Product } from 'lib/types';

export default function ProductGridItems({ products }: { products: Product[] }) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item
          key={product.handle}
          className="mb-4 animate-fadeIn border border-solid border-black"
        >
          <ProductCard product={product} />
        </Grid.Item>
      ))}
    </>
  );
}
