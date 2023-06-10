'use client';

import { GridTileImage } from 'components/grid/tile';
import useSelectedVariant from 'hooks/use-selected-variant';
import { Product } from 'lib/types';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { AddToCartStateBased } from './add-to-cart-state-based';
import { VariantSelectorStateBased } from './variant-selector-state-based';

export default function ProductCard({ product }: { product: Product }) {
  const [selectedVariant, optimizedVariants, chooseOptionHandler] = useSelectedVariant(
    product.variants
  );

  const searchParams = new URLSearchParams(selectedVariant?.params);
  const productHref = createUrl(`/product/${product.handle}`, searchParams);
  const price = selectedVariant ? selectedVariant.price : product.priceRange.maxVariantPrice.amount;

  const selectOptionHandler = (optionName: string, optionValue: string) => {
    chooseOptionHandler(optionName, optionValue);
  };

  return (
    <>
      <Link className="block aspect-square w-full overflow-hidden" href={productHref}>
        <GridTileImage
          alt={product.title}
          labels={{
            isSmall: true,
            title: product.title,
            amount: price,
            currencyCode: product.priceRange.maxVariantPrice.currencyCode
          }}
          src={product.featuredImage?.url}
          width={600}
          height={600}
        />
      </Link>
      {/* @ts-expect-error Server Component */}
      <VariantSelectorStateBased
        options={product.options}
        variants={optimizedVariants}
        selectedVariant={selectedVariant}
        small={true}
        onClickHandler={selectOptionHandler}
      />
      <AddToCartStateBased variant={selectedVariant || optimizedVariants[0]} small={true} />
    </>
  );
}
