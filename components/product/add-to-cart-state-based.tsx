'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import LoadingDots from 'components/loading-dots';
import { OptimizedVariant } from 'lib/types';

export function AddToCartStateBased({
  variant,
  small = false
}: {
  variant?: OptimizedVariant;
  small: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [adding, setAdding] = useState(false);

  const isMutating = adding || isPending;
  const availableForSale = variant && variant.availableForSale;

  async function handleAdd() {
    if (!availableForSale) return;

    setAdding(true);

    const response = await fetch(`/api/cart`, {
      method: 'POST',
      body: JSON.stringify({
        merchandiseId: variant.id
      })
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    setAdding(false);

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      aria-label="Add item to cart"
      disabled={isMutating}
      onClick={handleAdd}
      className={clsx(
        'flex w-full items-center justify-center bg-black p-4 text-sm uppercase tracking-wide text-white opacity-90 hover:opacity-100 dark:bg-white dark:text-black',
        {
          'cursor-not-allowed opacity-60': !availableForSale,
          'cursor-not-allowed': isMutating,
          'p-3 text-xs': small
        }
      )}
    >
      <span>{availableForSale ? 'Add To Cart' : 'Out Of Stock'}</span>
      {isMutating ? <LoadingDots className="bg-white dark:bg-black" /> : null}
    </button>
  );
}
