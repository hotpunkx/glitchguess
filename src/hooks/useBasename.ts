import { useEnsName, useEnsAvatar } from 'wagmi';
import { mainnet } from 'wagmi/chains';

/**
 * Hook to resolve Basenames (.base.eth) for a given address.
 * Uses the ENS resolution system on Mainnet with the Base coinType.
 */
export function useBasename(address?: `0x${string}`) {
  // Base chain ID is 8453. 
  // ENSIP-19 coinType for Base is 0x80000000 | 8453 = 2147492101
  const baseCoinType = 2147492101;

  const { data: name, isLoading: isNameLoading } = useEnsName({
    address,
    chainId: mainnet.id,
    // @ts-ignore - Some wagmi versions might not have coinType in types but it works
    coinType: baseCoinType,
  });

  const { data: avatar, isLoading: isAvatarLoading } = useEnsAvatar({
    name: name || undefined,
    chainId: mainnet.id,
  });

  return {
    name: name || null,
    avatar: avatar || null,
    isLoading: isNameLoading || isAvatarLoading,
  };
}
