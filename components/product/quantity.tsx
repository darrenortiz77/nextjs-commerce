'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProductVariant } from 'lib/types';

export function Quantity({ variants }: { variants: ProductVariant[] }) {
  const [selectedVariantId, setSelectedVariantId] = useState(variants[0]?.id);
  const searchParams = useSearchParams();
  const quantityAvail =
    variants.find((variant) => variant.id === selectedVariantId)?.quantityAvailable ?? '??';

  useEffect(() => {
    const variant = variants.find((variant: ProductVariant) =>
      variant.selectedOptions.every(
        (option) => option.value === searchParams.get(option.name.toLowerCase())
      )
    );

    if (variant) {
      setSelectedVariantId(variant.id);
    }
  }, [searchParams, variants, setSelectedVariantId]);

  return <p className="mb-8">Quantity available: {quantityAvail}</p>;
}
