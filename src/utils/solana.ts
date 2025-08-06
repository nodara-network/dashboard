import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { PublicKey } from "@solana/web3.js";
import idl from "../../target/idl/smart_contracts.json";
import { SmartContracts } from '../../target/types/smart_contracts';

export const programId = new PublicKey("NDRAKc9KJzfX2ymdJQ7Ad3sr4FSdP7wixVoTVTWt7hU");

export function getProgram(provider: AnchorProvider): Program<SmartContracts> {
  return new Program(idl as any, provider);
}

export const getProgramId = () => programId;
