import { Types } from 'aptos'

export const ADDRESS = '0xfae687586cfef86492d268a29c6df14bbb2ff2b51f6d7de476e07d579bca7dc9' as const

export type SwapSetAdminArgs = [string]

export const swapSetAdmin = (args: SwapSetAdminArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::swap::set_admin`,
  }
}

export type SwapSetFeeToArgs = [string]

export const swapSetFeeTo = (args: SwapSetFeeToArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::swap::set_fee_to`,
  }
}

export type SwapUpgradeSwapArgs = [number[] | Uint8Array, number[] | Uint8Array]

export const swapUpgradeSwap = (args: SwapUpgradeSwapArgs): Types.EntryFunctionPayload => {
  return {
    type_arguments: [],
    arguments: args,
    function: `${ADDRESS}::swap::upgrade_swap`,
  }
}

export const swapWithdrawFee = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::swap::withdraw_fee`,
  }
}

export type RouterAddLiquidityArgs = [bigint | string, bigint | string, bigint | string, bigint | string]

export const routerAddLiquidity = (
  args: RouterAddLiquidityArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::router::add_liquidity`,
  }
}

export const routerCreatePair = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::router::create_pair`,
  }
}

export const routerRegisterLp = (typeArgs: [string, string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::router::register_lp`,
  }
}

export const routerRegisterToken = (typeArgs: [string]): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: [],
    function: `${ADDRESS}::router::register_token`,
  }
}

export type RouterRemoveLiquidityArgs = [bigint | string, bigint | string, bigint | string]

export const routerRemoveLiquidity = (
  args: RouterRemoveLiquidityArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::router::remove_liquidity`,
  }
}

export type RouterSwapExactInputArgs = [bigint | string, bigint | string]

export const routerSwapExactInput = (
  args: RouterSwapExactInputArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::router::swap_exact_input`,
  }
}

export type RouterSwapExactInputDoublehopArgs = [bigint | string, bigint | string]

export const routerSwapExactInputDoublehop = (
  args: RouterSwapExactInputDoublehopArgs,
  typeArgs: [string, string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::router::swap_exact_input_doublehop`,
  }
}

export type RouterSwapExactInputTriplehopArgs = [bigint | string, bigint | string]

export const routerSwapExactInputTriplehop = (
  args: RouterSwapExactInputTriplehopArgs,
  typeArgs: [string, string, string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::router::swap_exact_input_triplehop`,
  }
}

export type RouterSwapExactOutputArgs = [bigint | string, bigint | string]

export const routerSwapExactOutput = (
  args: RouterSwapExactOutputArgs,
  typeArgs: [string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::router::swap_exact_output`,
  }
}

export type RouterSwapExactOutputDoublehopArgs = [bigint | string, bigint | string]

export const routerSwapExactOutputDoublehop = (
  args: RouterSwapExactOutputDoublehopArgs,
  typeArgs: [string, string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::router::swap_exact_output_doublehop`,
  }
}

export type RouterSwapExactOutputTriplehopArgs = [bigint | string, bigint | string]

export const routerSwapExactOutputTriplehop = (
  args: RouterSwapExactOutputTriplehopArgs,
  typeArgs: [string, string, string, string]
): Types.EntryFunctionPayload => {
  return {
    type_arguments: typeArgs,
    arguments: args,
    function: `${ADDRESS}::router::swap_exact_output_triplehop`,
  }
}
