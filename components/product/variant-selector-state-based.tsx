'use client';

import clsx from 'clsx';
import { OptimizedVariant, ProductOption } from 'lib/types';

// eslint-disable-next-line no-unused-vars
type ClickHandler = (optionName: string, optionValue: string) => void;

export function VariantSelectorStateBased({
  options,
  variants,
  selectedVariant,
  onClickHandler,
  small = false
}: {
  options: ProductOption[];
  variants: OptimizedVariant[];
  small: boolean;
  selectedVariant?: OptimizedVariant;
  onClickHandler: ClickHandler;
}) {
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  return options.map((option) => (
    <dl className={clsx({ 'mx-5 my-4': small, 'mb-8': !small })} key={option.id}>
      <dt
        className={clsx('uppercase', {
          'mb-2 text-[10px]': small,
          'mb-4 text-sm tracking-wide': !small
        })}
      >
        {option.name}
      </dt>
      <dd className="flex flex-wrap gap-3">
        {option.values.map((value) => {
          const isAvailableForSale =
            variants.find((variant) => {
              return variant[option.name.toLowerCase()] === value;
            }) !== undefined;

          const isActive = selectedVariant
            ? selectedVariant[option.name.toLowerCase()] === value
            : false;

          const DynamicTag = isAvailableForSale ? 'button' : 'p';

          return (
            <DynamicTag
              key={value}
              onClick={() => {
                onClickHandler(option.name, value);
              }}
              disabled={isActive || !isAvailableForSale}
              title={`${option.name} ${value}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
              className={clsx(
                'flex h-12 min-w-[48px] items-center justify-center rounded-full px-2 text-sm',
                {
                  'cursor-default ring-2 ring-black dark:ring-white': isActive,
                  'ring-1 ring-gray-300 transition duration-300 ease-in-out hover:scale-110 hover:bg-gray-100 hover:ring-black dark:ring-gray-700 dark:hover:bg-transparent dark:hover:ring-white':
                    !isActive && isAvailableForSale,
                  'relative z-10 cursor-not-allowed overflow-hidden bg-gray-100 ring-1 ring-gray-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-gray-300 before:transition-transform dark:bg-gray-900 dark:ring-gray-700 before:dark:bg-gray-700':
                    !isAvailableForSale,
                  'h-[32px] min-w-[32px] px-1 text-[10px]': small
                }
              )}
              data-testid={isActive ? 'selected-variant' : 'variant'}
            >
              {value}
            </DynamicTag>
          );
        })}
      </dd>
    </dl>
  ));
}
