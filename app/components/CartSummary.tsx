import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {CartLayout} from '~/components/CartMain';
import {CartForm, Money, type OptimisticCart} from '@shopify/hydrogen';
import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {useI18n} from '~/lib/i18n';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className =
    layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';
  const {t} = useI18n();

  return (
    <div aria-labelledby="cart-summary" className={`${className} flex flex-col gap-4 px-6 py-6 bg-white border-t border-dashed border-gray-200 mt-auto`}>
      <dl className="flex items-center justify-between text-sm font-medium text-agro-green mb-2">
        <dt>{t('cart_total')}</dt>
        <dd className="text-base font-normal">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : (
            '-'
          )}
        </dd>
      </dl>
      <CartDiscounts discountCodes={cart?.discountCodes} />
      <CartGiftCard giftCardCodes={cart?.appliedGiftCards} />
      <CartCheckoutActions checkoutUrl={cart?.checkoutUrl} />
    </div>
  );
}

function CartCheckoutActions({checkoutUrl}: {checkoutUrl?: string}) {
  const {t} = useI18n();
  if (!checkoutUrl) return null;

  return (
    <div className="mt-4">
      <a 
        href={checkoutUrl} 
        target="_self"
        className="flex items-center justify-center w-full px-6 py-3 bg-agro-green text-white text-[13px] font-bold uppercase rounded-sm hover:opacity-90 transition-opacity"
      >
        {t('checkout')}
      </a>
    </div>
  );
}

function CartDiscounts({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const codes: string[] =
    discountCodes
      ?.filter((discount) => discount.applicable)
      ?.map(({code}) => code) || [];

  return (
    <div className="mb-2">
      {/* Have existing discount, display it with a remove option */}
      <dl hidden={!codes.length}>
        <div>
          <dt className="sr-only">Discount(s)</dt>
          <UpdateDiscountForm>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <code>{codes?.join(', ')}</code>
              <button type="submit" aria-label="Remove discount" className="text-red-500 font-medium hover:underline">
                Remove
              </button>
            </div>
          </UpdateDiscountForm>
        </div>
      </dl>

      {/* Show an input to apply a discount */}
      <UpdateDiscountForm discountCodes={codes}>
        <div className="flex items-center gap-4">
          <label htmlFor="discount-code-input" className="sr-only">
            Discount code
          </label>
          <input
            id="discount-code-input"
            type="text"
            name="discountCode"
            placeholder="Discount code"
            className="flex-1 border border-gray-200 rounded-sm px-3 py-2 text-[13px] outline-none focus:border-agro-green placeholder:text-gray-400"
          />
          <button type="submit" aria-label="Apply discount code" className="text-[13px] font-bold text-agro-green hover:opacity-80">
            Apply
          </button>
        </div>
      </UpdateDiscountForm>
    </div>
  );
}

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{
        discountCodes: discountCodes || [],
      }}
    >
      {children}
    </CartForm>
  );
}

function CartGiftCard({
  giftCardCodes,
}: {
  giftCardCodes: CartApiQueryFragment['appliedGiftCards'] | undefined;
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});

  useEffect(() => {
    if (giftCardAddFetcher.data) {
      giftCardCodeInput.current!.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <div>
      {giftCardCodes && giftCardCodes.length > 0 && (
        <dl className="mb-2">
          <dt className="sr-only">Applied Gift Card(s)</dt>
          {giftCardCodes.map((giftCard) => (
            <RemoveGiftCardForm key={giftCard.id} giftCardId={giftCard.id}>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <code>***{giftCard.lastCharacters}</code>
                <div className="flex items-center gap-2">
                  <Money data={giftCard.amountUsed} />
                  <button type="submit" className="text-red-500 font-medium hover:underline">Remove</button>
                </div>
              </div>
            </RemoveGiftCardForm>
          ))}
        </dl>
      )}

      <AddGiftCardForm fetcherKey="gift-card-add">
        <div className="flex items-center gap-4">
          <input
            type="text"
            name="giftCardCode"
            placeholder="Gift card code"
            ref={giftCardCodeInput}
            className="flex-1 border border-gray-200 rounded-sm px-3 py-2 text-[13px] outline-none focus:border-agro-green placeholder:text-gray-400"
          />
          <button type="submit" disabled={giftCardAddFetcher.state !== 'idle'} className="text-[13px] font-bold text-agro-green hover:opacity-80 disabled:opacity-50">
            Apply
          </button>
        </div>
      </AddGiftCardForm>
    </div>
  );
}

function AddGiftCardForm({
  fetcherKey,
  children,
}: {
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesAdd}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{
        giftCardCodes: [giftCardId],
      }}
    >
      {children}
    </CartForm>
  );
}
