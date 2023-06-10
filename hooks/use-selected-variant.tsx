import { OptimizedVariant, ProductVariant } from 'lib/types';
import { useState } from 'react';

const getInitialChoices = (variants: ProductVariant[]) => {
  /*
  Find the first variant that is:
  1. Available for sale
  2. Default to first variant if none are available
  */
  const selectedVariant = variants.find((variant) => variant.availableForSale) || variants[0];

  const choices: Record<string, string> = {};

  if (selectedVariant) {
    selectedVariant.selectedOptions.forEach((option) => {
      choices[option.name.toLowerCase()] = option.value;
    });
  }

  return choices;
};

export default function useSelectedVariant(variants: ProductVariant[]) {
  const [chosenOptions, setChosenOptions] = useState(getInitialChoices(variants));

  // Optimize variants for easier lookups.
  const optimizedVariants: OptimizedVariant[] = variants.map((variant) => {
    const optimized: OptimizedVariant = {
      id: variant.id,
      availableForSale: variant.availableForSale,
      price: variant.price.amount,
      params: new URLSearchParams()
    };

    variant.selectedOptions.forEach((selectedOption) => {
      const name = selectedOption.name.toLowerCase();
      const value = selectedOption.value;

      optimized[name] = value;
      optimized.params.set(name, value);
    });

    return optimized;
  });

  const chooseOptionHandler = (optionName: string, optionValue: string) => {
    setChosenOptions((prevOptions) => ({
      ...prevOptions,
      [optionName.toLowerCase()]: optionValue
    }));
  };

  const selectedVariant: OptimizedVariant | undefined = optimizedVariants.find((variant) =>
    Object.entries(chosenOptions).every(([key, value]) => variant[key] === value)
  );

  return [selectedVariant, optimizedVariants, chooseOptionHandler] as const;
}
