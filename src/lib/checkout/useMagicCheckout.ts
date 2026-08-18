import { useCallback, useSyncExternalStore } from "react";

import { openMagicCheckout } from "./openMagicCheckout";
import { isCheckoutInProgress, subscribeCheckoutProgress } from "./magicCheckoutStore";

// Used by every purchase CTA. `isLoading` is shared globally (see magicCheckoutStore) so all
// buy buttons on a page disable together once one of them opens checkout.
export function useMagicCheckout(quantity = 1) {
  const isLoading = useSyncExternalStore(
    subscribeCheckoutProgress,
    isCheckoutInProgress,
    () => false,
  );
  const openCheckout = useCallback(() => {
    void openMagicCheckout(quantity);
  }, [quantity]);

  return { openCheckout, isLoading };
}
