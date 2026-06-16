import {useEffect} from 'react';
import {type FetcherWithComponents, useNavigate} from 'react-router';
import {CartForm, type OptimisticCartLineInput} from '@shopify/hydrogen';
import {Button, type ButtonProps} from '~/components/ui/button';

export interface AddToCartButtonProps extends ButtonProps {
  analytics?: unknown;
  children: React.ReactNode;
  disabled?: boolean;
  lines: Array<OptimisticCartLineInput>;
  onClick?: () => void;
  className?: string;
  /** Navigate to this path after the item is successfully added to cart */
  redirectTo?: string;
}

/**
 * Inner component extracted so we can use hooks (useEffect, useNavigate)
 * inside the CartForm render-prop.
 */
function CartFormContent({
  fetcher,
  analytics,
  onClick,
  disabled,
  className,
  variant,
  size,
  children,
  redirectTo,
  ...props
}: {
  fetcher: FetcherWithComponents<any>;
} & Omit<AddToCartButtonProps, 'lines'>) {
  const navigate = useNavigate();

  // Redirect AFTER the cart action finishes (fetcher goes back to 'idle' with data)
  useEffect(() => {
    if (redirectTo && fetcher.state === 'idle' && fetcher.data) {
      navigate(redirectTo);
    }
  }, [fetcher.state, fetcher.data, redirectTo, navigate]);

  return (
    <>
      <input
        name="analytics"
        type="hidden"
        value={JSON.stringify(analytics)}
      />
      <Button
        type="submit"
        onClick={onClick}
        disabled={disabled ?? fetcher.state !== 'idle'}
        className={className || "w-full"}
        variant={variant}
        size={size}
        {...props}
      >
        {children}
      </Button>
    </>
  );
}

export function AddToCartButton({
  analytics,
  children,
  disabled,
  lines,
  onClick,
  className,
  variant,
  size,
  redirectTo,
  ...props
}: AddToCartButtonProps) {
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => (
        <CartFormContent
          fetcher={fetcher}
          analytics={analytics}
          onClick={onClick}
          disabled={disabled}
          className={className}
          variant={variant}
          size={size}
          redirectTo={redirectTo}
          {...props}
        >
          {children}
        </CartFormContent>
      )}
    </CartForm>
  );
}

